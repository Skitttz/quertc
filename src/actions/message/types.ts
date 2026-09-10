import type { IMessage } from "@/interfaces/message";

interface IRequestSendMessage {
  chatId: string;
  senderId: string;
  text: string;
}

type SendMessageResponse = IMessage & Required<{ _id: string }>;

export type { IRequestSendMessage, SendMessageResponse };
