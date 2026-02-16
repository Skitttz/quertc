import type { IMessage } from "./message";
import type { IUser } from "./user";

interface IChat {
  _id: string;
  users: IUser[];
  createdBy: IUser;
  lastMessage?: IMessage | null;
  isGroupChat: boolean;
  groupName?: string;
  groupProfilePicture?: string;
  groupBio?: string;
  groupAdmins?: IUser[];
  createdAt: string;
  updatedAt: string;
  unreadCounts?: Record<string, number>;
}

export type { IChat };
