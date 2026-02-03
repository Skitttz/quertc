import type { IChat } from "./chat";
import type { IUser } from "./user";

export interface IMessage {
  _id: string;
  chat: IChat;
  sender: IUser;
  text: string;
  image: string;
  readBy: IUser[];
  createdAt: string;
  updatedAt: string;
}
