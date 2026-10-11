"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { markChatRead } from "@/actions/message";
import type { IChat } from "@/interfaces/chat";
import type { IMessage } from "@/interfaces/message";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/lib/socket-client";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { store } from "@/store";
import {
  AddChat,
  IncrementUnread,
  MarkChatRead,
  RemoveChat,
  ResetUnread,
  SetChatLastMessage,
  UpsertChat,
} from "@/store/slice/chat";
import {
  AddMessage,
  ForgetChatMessages,
  MarkMessagesRead,
  SelectChat,
  SetTyping,
  UpdateMessage,
} from "@/store/slice/message";
import { SetOnlineUsers, SetUserPresence } from "@/store/slice/presence";
import { fetchChatsByUser } from "@/store/thunks/chat";

type ChatSocketPayload = {
  chatId: string;
  message: IMessage;
  isNew?: boolean;
};
type TypingPayload = { chatId: string; userId: string; isTyping: boolean };

const TYPING_EXPIRES_MS = 6000;

const getSenderId = (sender: IMessage["sender"]) =>
  typeof sender === "string" ? sender : sender._id;

export function useChatSocket() {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const currentUserId = useAppSelector(
    (state) => state.user.currentUserData?._id,
  );
  const selectedChatId = useAppSelector(
    (state) => state.message.selectedChatId,
  );
  const chatCount = useAppSelector((state) => state.chat.chats.length);

  const getTokenRef = useRef(getToken);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    if (!currentUserId) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket({ getToken: () => getTokenRef.current() });
    const typingTimers = new Map<string, ReturnType<typeof setTimeout>>();

    const isOpen = (chatId: string) =>
      store.getState().message.selectedChatId === chatId;

    const handleNewMessage = (payload: ChatSocketPayload) => {
      dispatch(AddMessage(payload));

      const isMine = getSenderId(payload.message.sender) === currentUserId;
      if (!isMine && isOpen(payload.chatId)) {
        markChatRead({ chatId: payload.chatId });
      }
    };

    const handleChatUpdated = (payload: ChatSocketPayload) => {
      const isListed = store
        .getState()
        .chat.chats.some((chat) => chat._id === payload.chatId);

      if (!isListed) {
        dispatch(fetchChatsByUser(currentUserId));
        return;
      }

      dispatch(SetChatLastMessage(payload));

      if (isOpen(payload.chatId)) {
        dispatch(
          MarkChatRead({ chatId: payload.chatId, userId: currentUserId }),
        );
        return;
      }

      const isMine = getSenderId(payload.message.sender) === currentUserId;
      if (payload.isNew && !isMine) {
        dispatch(
          IncrementUnread({
            chatId: payload.chatId,
            mentioned: (payload.message.mentions ?? []).includes(currentUserId),
          }),
        );
      }
    };

    const handleChatCreated = ({ chat }: { chat: IChat }) => {
      dispatch(AddChat(chat));
    };

    const handleChatChanged = ({ chat }: { chat: IChat }) => {
      dispatch(UpsertChat(chat));
    };

    const handleChatRemoved = ({ chatId }: { chatId: string }) => {
      if (isOpen(chatId)) dispatch(SelectChat(null));
      dispatch(RemoveChat(chatId));
      dispatch(ForgetChatMessages(chatId));
    };

    const handleMessageUpdated = (payload: ChatSocketPayload) => {
      dispatch(UpdateMessage(payload));
    };

    const handleChatRead = (payload: { chatId: string; userId: string }) => {
      dispatch(MarkMessagesRead(payload));
      dispatch(MarkChatRead(payload));
      if (payload.userId === currentUserId) {
        dispatch(ResetUnread(payload.chatId));
      }
    };

    const handleTyping = (payload: TypingPayload) => {
      const key = `${payload.chatId}:${payload.userId}`;
      clearTimeout(typingTimers.get(key));
      dispatch(SetTyping(payload));

      if (payload.isTyping) {
        typingTimers.set(
          key,
          setTimeout(
            () => dispatch(SetTyping({ ...payload, isTyping: false })),
            TYPING_EXPIRES_MS,
          ),
        );
      }
    };

    const watchPresence = () => socket.emit("presence:watch");

    socket.on("message:new", handleNewMessage);
    socket.on("message:updated", handleMessageUpdated);
    socket.on("chat:updated", handleChatUpdated);
    socket.on("chat:created", handleChatCreated);
    socket.on("chat:changed", handleChatChanged);
    socket.on("chat:removed", handleChatRemoved);
    socket.on("chat:read", handleChatRead);
    socket.on("typing", handleTyping);
    socket.on("presence:sync", ({ online }: { online: string[] }) =>
      dispatch(SetOnlineUsers(online)),
    );
    socket.on(
      "presence:update",
      (payload: { userId: string; online: boolean }) =>
        dispatch(SetUserPresence(payload)),
    );
    socket.on("connect", watchPresence);
    if (socket.connected) watchPresence();

    return () => {
      for (const timer of typingTimers.values()) clearTimeout(timer);
      disconnectSocket();
    };
  }, [currentUserId, dispatch]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: chatCount is the trigger
  useEffect(() => {
    if (!currentUserId) return;

    getSocket()?.emit("presence:watch");
  }, [currentUserId, chatCount]);

  useEffect(() => {
    if (!currentUserId || !selectedChatId) return;

    const socket = getSocket();
    if (!socket) return;

    const joinRoom = () => socket.emit("chat:join", selectedChatId);

    joinRoom();
    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
      socket.emit("typing", { chatId: selectedChatId, isTyping: false });
      socket.emit("chat:leave", selectedChatId);
    };
  }, [currentUserId, selectedChatId]);
}
