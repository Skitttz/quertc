type NewChatDialogVariant = "add-contact" | "new-chat" | "new-group";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: NewChatDialogVariant;
}

export type { NewChatDialogProps, NewChatDialogVariant };
