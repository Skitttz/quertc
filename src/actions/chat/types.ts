import type { IChat } from "@/interfaces/chat";

interface IRequestCreateChat {
  users: [string, string];
  createdBy: string;
}

interface IRequestCreateGroupChat {
  users: string[];
  createdBy: string;
  groupName: string;
}

type CreateChatResponse = IChat & Required<{ _id: string }> & { __v: number };

export type { CreateChatResponse, IRequestCreateChat, IRequestCreateGroupChat };
