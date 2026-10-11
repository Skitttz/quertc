interface IProfileDrawerProps {
  closeDrawer: () => void;
  name: string;
  userId: string;
  registrationDate: string;
  defaultAvatar: string;
  onAvatarChange?: (file: string) => void;
  onAvatarLoaded: () => void;
  isAvatarLoading: boolean;
}

interface IUploadStateProps {
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export type { IProfileDrawerProps, IUploadStateProps };
