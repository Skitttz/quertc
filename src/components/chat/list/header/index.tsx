import { Input } from "@/components/ui/input";
import { TextSearchIcon } from "lucide-react";
import { NewChatDropdown } from "../new";

export function ChatHeaderList({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2 py-2  ">
      <div className="flex gap-2 justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <NewChatDropdown />
      </div>
      <Input
        icon={<TextSearchIcon className="text-blue-900" size={21} />}
        className="w-full py-4 rounded-sm transition-all ring-0 focus-visible:ring-0 indent-1"
        placeholder="Buscar conversa"
      />
    </div>
  );
}
