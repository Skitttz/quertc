import type { IUserWithVirtual } from "@/interfaces/user";

export interface IUserState {
  currentUserData: IUserWithVirtual | null;
  currentUserId: string;
}
