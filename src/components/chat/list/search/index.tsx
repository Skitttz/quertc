import type { IChat } from "@/interfaces/chat";
import type { IMessage } from "@/interfaces/message";
import { ChatItem } from "../item";
import { MessageSearchItem } from "./item";

const getChatId = (chat: IMessage["chat"]) =>
  typeof chat === "string" ? chat : chat._id;

export function ChatSearchResults({
  chats,
  currentUserId,
  matchingChats,
  messages,
  onSelect,
  query,
  searchingMessages,
  selectedChatId,
}: {
  chats: IChat[];
  currentUserId: string | undefined;
  matchingChats: IChat[];
  messages: IMessage[];
  onSelect: (chatId: string) => void;
  query: string;
  searchingMessages: boolean;
  selectedChatId: string | null;
}) {
  const messageResults = messages.flatMap((message) => {
    const chat = chats.find((item) => item._id === getChatId(message.chat));
    return chat ? [{ chat, message }] : [];
  });

  const hasResults = matchingChats.length > 0 || messageResults.length > 0;

  if (!hasResults) {
    return (
      <p className="px-4 py-10 text-center text-sm text-muted-foreground">
        {searchingMessages ? "Buscando…" : `Nenhum resultado para “${query}”.`}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-2">
      {matchingChats.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Conversas
          </h3>
          {matchingChats.map((chat) => (
            <ChatItem
              key={chat._id}
              {...chat}
              isSelected={chat._id === selectedChatId}
              onSelect={onSelect}
            />
          ))}
        </section>
      )}

      {messageResults.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Mensagens
          </h3>
          {messageResults.map(({ chat, message }) => (
            <MessageSearchItem
              key={message._id}
              chat={chat}
              currentUserId={currentUserId}
              isSelected={chat._id === selectedChatId}
              message={message}
              onSelect={onSelect}
              query={query}
            />
          ))}
        </section>
      )}
    </div>
  );
}
