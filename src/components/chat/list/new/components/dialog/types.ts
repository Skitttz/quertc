type NewChatDialogVariant = "add-contact" | "new-chat" | "new-group";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVariantChange: (variant: NewChatDialogVariant) => void;
  variant: NewChatDialogVariant;
}

interface NewChatContentProps {
  handleCloseDialog: () => void;
  onAddContact: () => void;
}

export type { NewChatContentProps, NewChatDialogProps, NewChatDialogVariant };
