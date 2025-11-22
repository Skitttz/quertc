import type { IUserWithVirtual } from "@/interfaces/user";

type DeviceType = "desktop" | "mobile";

interface IHeaderRenderProps {
  isSticky: boolean;
  isDrawerOpen: boolean;
  onDrawerOpenChange: (v: boolean) => void;
}

type SafeUserType = Omit<
  IUserWithVirtual,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "email"
  | "firstName"
  | "lastName"
  | "username"
  | "profilePicture"
> & {
  _id: string;
  createdAt: string;
  profilePicture: string | undefined;
};

interface IHeaderProps {
  currentUser: SafeUserType | null;
}

export type { DeviceType, IHeaderProps, IHeaderRenderProps };
