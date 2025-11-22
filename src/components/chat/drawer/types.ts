interface IProfileDrawerProps {
  closeDrawer: () => void;
  name: string;
  userId: string;
  registrationDate: string;
  avatarUrl?: string;
  onAvatarChange?: (file: File) => void;
}
export type { IProfileDrawerProps };
