import type { MessageType } from "../../types";

type Props = {
  message: MessageType;
};

export function MessageBubble({ message }: Props) {
  const align = message.received ? "justify-start" : "justify-end";
  const corner = message.received ? "rounded-bl-sm" : "rounded-br-sm";
  const bgColor = message.received ? "bg-gray-600" : "bg-primary";

  return (
    <div className={`flex w-full ${align}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${corner} text-primary-foreground ${
          bgColor
        }`}
      >
        {message.lines.map((line) => (
          <p key={line} className="whitespace-pre-line break-words">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
