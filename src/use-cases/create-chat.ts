"use client";

import { postNewChat, postNewGroupChat } from "@/actions/chat";
import type {
  IRequestCreateChat,
  IRequestCreateGroupChat,
} from "@/actions/chat/types";
import { useAppDispatch } from "@/providers/store/hooks";
import { AddChat } from "@/store/slice/chat";

export function useChat() {
  const dispatch = useAppDispatch();

  async function createChat(payload: IRequestCreateChat) {
    const newChat = await postNewChat({ payload });
    if (!newChat) {
      return null;
    }
    dispatch(AddChat(newChat));
    return newChat;
  }

  async function createGroupChat(payload: IRequestCreateGroupChat) {
    const newChat = await postNewGroupChat({ payload });
    if (!newChat) {
      return null;
    }
    dispatch(AddChat(newChat));
    return newChat;
  }

  return { createChat, createGroupChat };
}
