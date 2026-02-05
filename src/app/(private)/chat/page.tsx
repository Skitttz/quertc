import { ChatArea } from "@/components/chat/area";
import { ChatList } from "@/components/chat/list";

export default async function ChatPage() {
  return <div className="grid grid-cols-[400px_minmax(400px,_1fr)] p-5 h-[85vh] gap-4">
    <ChatList/>
    <ChatArea/>
  </div>;
}
