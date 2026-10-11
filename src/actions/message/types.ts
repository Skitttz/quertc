import type { IMessage } from "@/interfaces/message";

interface IRequestSendMessage {
  chatId: string;
  senderId: string;
  text: string;
  image?: string;
}

interface IRequestGetMessages {
  chatId: string;
  before?: string;
  around?: string;
}

type SendMessageResponse = IMessage & Required<{ _id: string }>;

interface MessagePage {
  messages: IMessage[];
  hasMore: boolean;
}

export type {
  IRequestGetMessages,
  IRequestSendMessage,
  MessagePage,
  SendMessageResponse,
};
