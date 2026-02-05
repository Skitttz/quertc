"use server";
import { connectToDatabase } from "@/config/database";
import type { IUserWithVirtual } from "@/interfaces/user";
import { UserModel } from "@/models/user";
import { currentUser } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { ALLOWED_FIELDS } from "./constants";
import type {
  AllowedUserFieldsUpdateType,
  UpdateUserInput,
  UpdateUserResult,
} from "./types";

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

    const newUserPayload = {
      clerkUserId: clerkUser.id,
      firstName: clerkUser.firstName ?? "",
      lastName: clerkUser.lastName ?? "",
      username: clerkUser.username ?? "",
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      profilePicture: clerkUser.imageUrl,
    };

    if (!newUserPayload.clerkUserId || !newUserPayload.email) {
      throw new Error("Missing required user data");
    }

    const newUser = await UserModel.create(newUserPayload);
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

export const getAllUsers = async (): Promise<IUserWithVirtual[]> => {
  try {
    await connectToDatabase();

    const users = await UserModel.find().lean();

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

  await UserModel.findByIdAndUpdate(user._id, {
    $set: { profilePicture: avatarUrl },
  });
}
