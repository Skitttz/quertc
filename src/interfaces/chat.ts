import type { IMessage } from "./message";
import type { IPublicUser } from "./user";

interface IChat {
  _id: string;
  users: IPublicUser[];
  createdBy: string;
  lastMessage?: IMessage | null;
  isGroupChat: boolean;
  groupName?: string;
  groupProfilePicture?: string;
  groupBio?: string;
  groupAdmins?: string[];
  createdAt: string;
  updatedAt: string;
  unreadCounts?: Record<string, number>;
  hiddenFor?: string[];
  clearedAt?: Map<string, Date>;
}

export type { IChat };
