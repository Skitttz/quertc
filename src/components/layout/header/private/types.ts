type DeviceType = "desktop" | "mobile";

interface IHeaderRenderProps {
  isSticky: boolean;
  isDrawerOpen: boolean;
  onDrawerOpenChange: (v: boolean) => void;
}

interface ISafeUserType {
  _id: string;
  clerkUserId: string | null;
  name: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  doNotDisturb?: boolean;
  email: string;
  profilePicture?: string | null;
  createdAt: string;
}

export type { DeviceType, IHeaderRenderProps, ISafeUserType };
