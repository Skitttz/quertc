import type { IUserWithVirtual } from "@/interfaces/user";
import type { IUserClient } from "./types";

export function serializeUser(user: IUserWithVirtual): IUserClient {
  return {
    _id: user._id.toString(),
    clerkUserId: user.clerkUserId,
    name: user.name ?? "",
    email: user.email ?? "",
    profilePicture: user.profilePicture ?? null,
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : String(user.createdAt),
    updatedAt:
      user.updatedAt instanceof Date
        ? user.updatedAt.toISOString()
        : String(user.updatedAt),
  };
}
