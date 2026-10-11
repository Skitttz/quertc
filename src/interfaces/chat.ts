import type { IMessage } from "./message";
import type { IPublicUser } from "./user";

type IPinnedMessage = Pick<
  IMessage,
  "_id" | "text" | "image" | "sender" | "createdAt" | "deletedAt"
>;

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
  pinnedMessages?: IPinnedMessage[];
  unreadCount?: number;
  hasUnreadMention?: boolean;
  hiddenFor?: string[];
  clearedAt?: Map<string, Date>;
}

export type { IChat, IPinnedMessage };
