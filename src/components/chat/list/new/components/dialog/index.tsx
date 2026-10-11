import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dialogConfig } from "./constants";
import { newChatContentMap } from "./content";
import type { NewChatDialogProps } from "./types";

export function NewChatDialog({
  open,
  onOpenChange,
  onVariantChange,
  variant,
}: NewChatDialogProps) {
  const config = dialogConfig[variant];
  const Content = newChatContentMap[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <Content
          handleCloseDialog={() => onOpenChange(false)}
          onAddContact={() => onVariantChange("add-contact")}
        />
      </DialogContent>
    </Dialog>
  );
}
