interface NewChatListUsersProps {
  isGroup: boolean;
  button?: {
    labelAction?: string;
  };
  handleCloseDialog: () => void;
}

export type { NewChatListUsersProps };
