import type { IChat } from "./chat";
import type { IPublicUser } from "./user";

export interface IMessage {
  _id: string;
  chat: IChat | string;
  sender: IPublicUser | string;
  text: string;
  image: string;
  readBy: Array<IPublicUser | string>;
  createdAt: string;
  updatedAt: string;
}
