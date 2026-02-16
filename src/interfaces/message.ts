import type { IChat } from "./chat";
import type { IUser } from "./user";

export interface IMessage {
  _id: string;
  chat: IChat | string;
  sender: IUser | string;
  text: string;
  image: string;
  readBy: Array<IUser | string>;
  createdAt: string;
  updatedAt: string;
}
