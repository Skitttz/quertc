import type { IChat } from "@/interfaces/chat";
import type { IMessage } from "@/interfaces/message";
import { normalizeText } from "./text-helpers";

type ChatDisplaySource = Pick<
  IChat,
  "isGroupChat" | "groupName" | "groupProfilePicture" | "users"
>;

const getChatDisplay = ({
  chat,
  currentUserId,
}: {
  chat: ChatDisplaySource;
  currentUserId: string | undefined;
}) => {
  const recipient = !chat.isGroupChat
    ? chat.users.find((user) => user._id !== currentUserId)
    : null;

  const avatarSrc = chat.isGroupChat
    ? chat.groupProfilePicture || ""
    : recipient?.profilePicture || "";

  const displayName = chat.isGroupChat
    ? chat.groupName
    : (recipient?.username ?? "Usuário");

  return { avatarSrc, displayName };
};

const chatMatchesSearch = ({
  chat,
  currentUserId,
  query,
}: {
  chat: ChatDisplaySource;
  currentUserId: string | undefined;
  query: string;
}) => {
  const term = normalizeText(query);

  if (chat.isGroupChat) {
    return normalizeText(chat.groupName ?? "").includes(term);
  }

  const recipient = chat.users.find((user) => user._id !== currentUserId);
  if (!recipient) return false;

  return [
    recipient.username,
    `${recipient.firstName} ${recipient.lastName}`,
  ].some((value) => normalizeText(value ?? "").includes(term));
};

const getMessagePreview = (
  message: Pick<IMessage, "text" | "image" | "deletedAt">,
) => {
  if (message.deletedAt) return "Mensagem apagada";
  if (message.text) return message.text;
  if (message.image) return "📷 Foto";
  return "";
};

const getUserDisplayName = (
  user: { firstName?: string; username?: string } | undefined,
) => user?.firstName || user?.username || "Alguém";

export {
  chatMatchesSearch,
  getChatDisplay,
  getMessagePreview,
  getUserDisplayName,
};
