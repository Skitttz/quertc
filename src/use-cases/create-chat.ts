"use client";

import { postNewChat } from "@/actions/chat";
import type { IRequestCreateChat } from "@/actions/chat/types";
import { useAppDispatch } from "@/providers/store/hooks";
import { AddChat } from "@/store/slice/chat";

export function useChat() {
  const dispatch = useAppDispatch();

  async function createChat(payload: IRequestCreateChat) {
    const newChat = await postNewChat({ payload });
    dispatch(AddChat(newChat));
    return newChat;
  }

  return { createChat };
}
