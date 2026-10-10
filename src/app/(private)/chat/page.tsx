import { ChatArea } from "@/components/chat/area";
import { ChatList } from "@/components/chat/list";

export default async function ChatPage() {
  return (
    <div className="grid grid-cols-1 gap-4 p-3 md:h-[85vh] md:grid-cols-[minmax(280px,400px)_minmax(0,1fr)] md:p-5">
      <ChatList />
      <ChatArea />
    </div>
  );
}
