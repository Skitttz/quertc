import type { ISafeUserType } from "@/components/layout/header/private/types";
import type { IUserWithVirtual } from "@/interfaces/user";
import { toISOString } from "./date-helpers";

export function mapUserToSafeUser(
  user?: IUserWithVirtual | null,
): ISafeUserType | null {
  if (!user) return null;

  return {
    _id: String(user._id),
    clerkUserId: user.clerkUserId ?? null,
    name: user.name ?? "",
    email: user.email ?? "",
    profilePicture: user.profilePicture ?? null,
    createdAt: toISOString(user.createdAt),
  };
}
