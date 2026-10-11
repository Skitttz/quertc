"use server";
import { currentUser } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/config/database";
import type { IPublicUserWithName, IUserWithVirtual } from "@/interfaces/user";
import { getAuthenticatedUser } from "@/lib/auth";
import { PUBLIC_USER_FIELDS, UserModel } from "@/models/user";
import { isFirebaseStorageUrl } from "@/utils/storage-url";
import { ALLOWED_FIELDS } from "./constants";
import type {
  AllowedUserFieldsUpdateType,
  UpdateUserInput,
  UpdateUserResult,
} from "./types";

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

export const getAllUsers = async (): Promise<IPublicUserWithName[]> => {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return [];

    const users = await UserModel.find().select(PUBLIC_USER_FIELDS).lean();

    return users.map((user) => ({
      ...user,
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`.trim(),
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function updateUser<T>({
  userId,
  payload,
}: UpdateUserInput<T>): Promise<UpdateUserResult<T>> {
  try {
    await connectToDatabase();

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "Não autenticado" };
    }

    if (!Types.ObjectId.isValid(userId)) {
      return { error: "User ID inválido" };
    }

    const safePayload = Object.fromEntries(
      Object.entries(payload).filter(([key]) =>
        ALLOWED_FIELDS.includes(key as AllowedUserFieldsUpdateType),
      ),
    );

    if (Object.keys(safePayload).length === 0) {
      return { error: "Nenhum campo permitido para atualização" };
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId, clerkUserId: clerkUser.id },
      { $set: safePayload },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!updatedUser) {
      return { error: "Usuário não encontrado" };
    }

    return { data: updatedUser as T };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Erro inesperado ao atualizar usuário",
    };
  }
}

export async function updateUserAvatar({ avatarUrl }: { avatarUrl: string }) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autenticado");
  if (!isFirebaseStorageUrl(avatarUrl)) throw new Error("Foto inválida");

  await UserModel.findByIdAndUpdate(user._id, {
    $set: { profilePicture: avatarUrl },
  });
}
