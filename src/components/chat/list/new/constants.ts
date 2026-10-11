enum NewChatDialogKeyEnum {
  NEW_CHAT = "new-chat",
  NEW_GROUP = "new-group",
  ADD_CONTACT = "add-contact",
}

const newChatDropdownItems = [
  {
    label: "Criar nova conversa",
    dialogKey: NewChatDialogKeyEnum.NEW_CHAT,
  },
  { label: "Criar novo grupo", dialogKey: NewChatDialogKeyEnum.NEW_GROUP },
  {
    label: "Adicionar contato",
    dialogKey: NewChatDialogKeyEnum.ADD_CONTACT,
  },
] as const;

export { NewChatDialogKeyEnum, newChatDropdownItems };
