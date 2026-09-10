import type { IChat } from "@/interfaces/chat";

interface ChatItemProps extends IChat {
  isSelected: boolean;
  onSelect: (chatId: string) => void;
}

export type { ChatItemProps };
