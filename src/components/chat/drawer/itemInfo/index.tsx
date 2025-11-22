import type { IItemInfoProps } from "./types";

export function ItemInfo({ name, value, icon }: IItemInfoProps) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{name}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}
