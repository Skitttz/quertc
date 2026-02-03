import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { IItemInfoProps } from "./types";

export function ItemInfo({ name, value, icon,tooltip }: IItemInfoProps) {
  const content = (<div className="flex items-start gap-3">
      <div>{icon}</div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{name}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
    </div>
  )

  if (!tooltip) {
    return content;
  }
  

  return (<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>{content}</TooltipTrigger>
    <TooltipContent side={tooltip?.side}>
      {tooltip?.content}
    </TooltipContent>
  </Tooltip>
</TooltipProvider>)
}
