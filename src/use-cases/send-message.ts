"use client";

import { postNewMessage } from "@/actions/message";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { SetChatLastMessage } from "@/store/slice/chat";
import { AddMessage } from "@/store/slice/message";

export function useSendMessage() {
  const dispatch = useAppDispatch();
  const { currentUserData } = useAppSelector((state) => state.user);

  async function sendMessage({
    chatId,
    text,
    image,
  }: {
    chatId: string;
    text: string;
    image?: string;
  }) {
    if (!currentUserData?._id) return null;

    const message = await postNewMessage({
      payload: { chatId, senderId: currentUserData._id, text, image },
    });
    if (!message) return null;

    dispatch(AddMessage({ chatId, message }));
    dispatch(SetChatLastMessage({ chatId, message }));

    return message;
  }

  return { sendMessage };
}
