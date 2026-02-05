import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dialogConfig } from "./constants";
import { AddContactContent, NewChatContent, NewGroupContent } from "./content";
import type { NewChatDialogProps } from "./types";

export function NewChatDialog({
  open,
  onOpenChange,
  variant,
}: NewChatDialogProps) {
  const config = dialogConfig[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {variant === "add-contact" && (
          <AddContactContent handleCloseDialog={() => onOpenChange(false)} />
        )}

        {variant === "new-chat" && (
          <NewChatContent handleCloseDialog={() => onOpenChange(false)} />
        )}

        {variant === "new-group" && (
          <NewGroupContent handleCloseDialog={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
