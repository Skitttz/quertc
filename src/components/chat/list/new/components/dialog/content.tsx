import { AddContactForm } from "../contact";
import { NewGroupChatForm } from "../group";
import { NewChatListUsers } from "../list";
import type { NewChatContentProps, NewChatDialogVariant } from "./types";

export function AddContactContent() {
  return <AddContactForm />;
}

export function NewChatContent({
  handleCloseDialog,
  onAddContact,
}: NewChatContentProps) {
  return (
    <NewChatListUsers
      handleCloseDialog={handleCloseDialog}
      onAddContact={onAddContact}
    />
  );
}

export function NewGroupContent({
  handleCloseDialog,
  onAddContact,
}: NewChatContentProps) {
  return (
    <NewGroupChatForm
      handleCloseDialog={handleCloseDialog}
      onAddContact={onAddContact}
    />
  );
}

export const newChatContentMap: Record<
  NewChatDialogVariant,
  React.ComponentType<NewChatContentProps>
> = {
  "add-contact": AddContactContent,
  "new-chat": NewChatContent,
  "new-group": NewGroupContent,
};
