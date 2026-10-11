import type { IChat } from "./chat";
import type { IPublicUser } from "./user";

export interface IMessageReaction {
  user: string;
  emoji: string;
}

export interface IMessage {
  _id: string;
  chat: IChat | string;
  sender: IPublicUser | string;
  text: string;
  image: string;
  readBy: Array<IPublicUser | string>;
  reactions: IMessageReaction[];
  mentions?: string[];
  editedAt?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
