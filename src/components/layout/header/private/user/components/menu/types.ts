interface IUserMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  userId: string;
  profilePicture: string;
  registrationDate: string;
  variant: "desktop" | "mobile";
  onAvatarChange: (newAvatarUrl: string) => void;
  onAvatarLoaded: () => void;
  isAvatarLoading: boolean;
}

export type { IUserMenuProps };
