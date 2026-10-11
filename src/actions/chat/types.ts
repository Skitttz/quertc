import type { IChat } from "@/interfaces/chat";

interface IRequestCreateChat {
  users: [string, string];
  createdBy: string;
}

interface IRequestCreateGroupChat {
  users: string[];
  createdBy: string;
  groupName: string;
  groupProfilePicture?: string;
}

interface IRequestUpdateGroup {
  chatId: string;
  groupName?: string;
  groupBio?: string;
  groupProfilePicture?: string;
}

type CreateChatResponse = IChat & Required<{ _id: string }> & { __v: number };

export type {
  CreateChatResponse,
  IRequestCreateChat,
  IRequestCreateGroupChat,
  IRequestUpdateGroup,
};
