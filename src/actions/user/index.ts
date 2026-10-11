"use server";
import { currentUser } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/config/database";
import type {
  IPublicUserWithName,
  IUserSearchResult,
  IUserWithVirtual,
} from "@/interfaces/user";
import { getAuthenticatedUser } from "@/lib/auth";
import { PUBLIC_USER_FIELDS, UserModel } from "@/models/user";
import { toAccentInsensitivePattern } from "@/utils/search-helpers";
import { isFirebaseStorageUrl } from "@/utils/storage-url";
import {
  BIO_MAX_LENGTH,
  NAME_MAX_LENGTH,
  USER_SEARCH_LIMIT,
  USER_SEARCH_MAX_LENGTH,
  USER_SEARCH_MIN_LENGTH,
} from "./constants";
import type { IRequestUpdateProfile, UpdateProfileResult } from "./types";

const toUsernameBase = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "user";

async function generateUsername({ email }: { email: string }) {
  const base = toUsernameBase(email.split("@")[0]);
  let candidate = base;

  while (await UserModel.exists({ username: candidate })) {
    const suffix = Math.random().toString(36).slice(2, 6).padEnd(4, "0");
    candidate = `${base}_${suffix}`;
  }

  return candidate;
}

export const getCurrentUser = async (): Promise<IUserWithVirtual | null> => {
  try {
    await connectToDatabase();
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    const mongoUser = await UserModel.findOne({
      clerkUserId: clerkUser.id,
    }).lean();

    if (mongoUser) {
      return {
        ...mongoUser,
        name: `${mongoUser.firstName} ${mongoUser.lastName}`.trim(),
      };
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

    if (!clerkUser.id || !email) {
      throw new Error("Missing required user data");
    }

    const username = clerkUser.username || (await generateUsername({ email }));

    const newUserPayload = {
      clerkUserId: clerkUser.id,
      firstName: clerkUser.firstName || username,
      lastName: clerkUser.lastName ?? "",
      username,
      email,
      profilePicture: clerkUser.imageUrl,
    };

    const newUser = await UserModel.create(newUserPayload).catch(
      async (error) => {
        const existing = await UserModel.findOne({ clerkUserId: clerkUser.id });
        if (!existing) throw error;
        return existing;
      },
    );
    const user = newUser.toJSON();

    return {
      ...user,
      name: `${user.firstName} ${user.lastName}`.trim(),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

type PublicUserSource = {
  _id: unknown;
  firstName: string;
  lastName?: string;
  username: string;
  profilePicture?: string;
  bio?: string;
};

const toPublicUser = (user: PublicUserSource): IPublicUserWithName => ({
  _id: String(user._id),
  firstName: user.firstName,
  lastName: user.lastName ?? "",
  username: user.username,
  ...(user.profilePicture ? { profilePicture: user.profilePicture } : {}),
  ...(user.bio ? { bio: user.bio } : {}),
  name: `${user.firstName} ${user.lastName ?? ""}`.trim(),
});

export const getContacts = async (): Promise<IPublicUserWithName[]> => {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return [];

    const contacts = await UserModel.find({ _id: { $in: authUser.contacts } })
      .select(PUBLIC_USER_FIELDS)
      .sort({ firstName: 1, lastName: 1 })
      .lean();

    return contacts.map(toPublicUser);
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    return [];
  }
};

export const searchUsers = async ({
  query,
}: {
  query: string;
}): Promise<IUserSearchResult[]> => {
  const term =
    typeof query === "string"
      ? query.trim().slice(0, USER_SEARCH_MAX_LENGTH)
      : "";
  if (term.length < USER_SEARCH_MIN_LENGTH) return [];

  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return [];

    const isId = term.length === 24 && Types.ObjectId.isValid(term);
    const matchesTerm = isId
      ? { _id: term }
      : {
          $and: term.split(/\s+/).map((word) => {
            const pattern = {
              $regex: toAccentInsensitivePattern(word),
              $options: "i",
            };
            return {
              $or: [
                { firstName: pattern },
                { lastName: pattern },
                { username: pattern },
              ],
            };
          }),
        };

    const users = await UserModel.find({
      ...matchesTerm,
      clerkUserId: { $ne: authUser.clerkUserId },
    })
      .select(PUBLIC_USER_FIELDS)
      .sort({ firstName: 1, lastName: 1 })
      .limit(USER_SEARCH_LIMIT)
      .lean();

    const contactIds = (authUser.contacts ?? []).map(String);

    return users.map((user) => ({
      ...toPublicUser(user),
      isContact: contactIds.includes(String(user._id)),
    }));
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
};

export const addContact = async ({
  userId,
}: {
  userId: string;
}): Promise<IPublicUserWithName | null> => {
  try {
    if (!Types.ObjectId.isValid(userId)) return null;

    const authUser = await getAuthenticatedUser();
    if (!authUser || String(authUser._id) === userId) return null;

    const contact = await UserModel.findById(userId)
      .select(PUBLIC_USER_FIELDS)
      .lean();
    if (!contact) return null;

    await UserModel.updateOne(
      { _id: authUser._id },
      { $addToSet: { contacts: contact._id } },
    );

    return toPublicUser(contact);
  } catch (error) {
    console.error("Erro ao adicionar contato:", error);
    return null;
  }
};

export const removeContact = async ({
  userId,
}: {
  userId: string;
}): Promise<boolean> => {
  try {
    if (!Types.ObjectId.isValid(userId)) return false;

    const authUser = await getAuthenticatedUser();
    if (!authUser) return false;

    await UserModel.updateOne(
      { _id: authUser._id },
      { $pull: { contacts: userId } },
    );

    return true;
  } catch (error) {
    console.error("Erro ao remover contato:", error);
    return false;
  }
};

export const updateProfile = async (
  payload: IRequestUpdateProfile,
): Promise<UpdateProfileResult> => {
  try {
    const firstName = (payload.firstName ?? "").trim();
    const lastName = (payload.lastName ?? "").trim();
    const bio = (payload.bio ?? "").trim();

    if (!firstName) return { error: "Informe o seu nome." };
    if (
      firstName.length > NAME_MAX_LENGTH ||
      lastName.length > NAME_MAX_LENGTH
    ) {
      return {
        error: `Nome e sobrenome têm até ${NAME_MAX_LENGTH} caracteres.`,
      };
    }
    if (bio.length > BIO_MAX_LENGTH) {
      return { error: `A bio tem até ${BIO_MAX_LENGTH} caracteres.` };
    }

    const authUser = await getAuthenticatedUser();
    if (!authUser) return { error: "Não autenticado" };

    await UserModel.updateOne(
      { _id: authUser._id },
      { $set: { firstName, lastName, bio } },
    );

    return {
      data: {
        firstName,
        lastName,
        bio,
        name: `${firstName} ${lastName}`.trim(),
      },
    };
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return { error: "Não foi possível salvar o perfil. Tente novamente." };
  }
};

export async function updateUserAvatar({ avatarUrl }: { avatarUrl: string }) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autenticado");
  if (!isFirebaseStorageUrl(avatarUrl)) throw new Error("Foto inválida");

  await UserModel.findByIdAndUpdate(user._id, {
    $set: { profilePicture: avatarUrl },
  });
}
