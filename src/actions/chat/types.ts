import type { IChat } from "@/interfaces/chat";

interface IRequestCreateChat {
  users: [string, string];
  createdBy: string;
  isGroupChat: boolean;
}

type CreateChatResponse = IChat & Required<{ _id: string }> & { __v: number };

export type { CreateChatResponse, IRequestCreateChat };
