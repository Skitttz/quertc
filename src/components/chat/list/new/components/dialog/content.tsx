import { NewGroupChatForm } from "../group";
import { NewChatListUsers } from "../list";
import type { NewChatDialogVariant } from "./types";

export function AddContactContent({
  handleCloseDialog,
}: {
  handleCloseDialog: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <NewChatListUsers handleCloseDialog={handleCloseDialog} />
    </div>
  );
}

export function NewChatContent({
  handleCloseDialog,
}: {
  handleCloseDialog: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <NewChatListUsers
        handleCloseDialog={handleCloseDialog}
        button={{ labelAction: "Selecionar" }}
      />
    </div>
  );
}

export function NewGroupContent({
  handleCloseDialog,
}: {
  handleCloseDialog: () => void;
}) {
  return <NewGroupChatForm handleCloseDialog={handleCloseDialog} />;
}

export const newChatContentMap: Record<
  NewChatDialogVariant,
  React.ComponentType<{ handleCloseDialog: () => void }>
> = {
  "add-contact": AddContactContent,
  "new-chat": NewChatContent,
  "new-group": NewGroupContent,
};
