import { TextSearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NewChatDropdown } from "../new";

export function ChatHeaderList({
  onSearchChange,
  search,
  title,
}: {
  onSearchChange: (value: string) => void;
  search: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-2 pb-2">
      <div className="flex gap-2 justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <NewChatDropdown />
      </div>
      <Input
        type="search"
        aria-label="Buscar conversa"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        icon={<TextSearchIcon className="text-blue-900" size={21} />}
        className="w-full py-4 rounded-sm transition-all indent-1"
        placeholder="Buscar conversa"
      />
    </div>
  );
}
