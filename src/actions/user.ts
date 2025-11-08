import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/config/database";
import type { IUserWithVirtual } from "@/interfaces/user";
import { UserModel } from "@/models/user";

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
