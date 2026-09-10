import type { IChat } from "@/interfaces/chat";

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

export { getChatDisplay };
