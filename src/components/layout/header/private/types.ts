import type { IUserWithVirtual } from "@/interfaces/user";

type DeviceType = "desktop" | "mobile";

interface IHeaderRenderProps {
  isSticky: boolean;
  isDrawerOpen: boolean;
  onDrawerOpenChange: (v: boolean) => void;
}

type ISafeUserType = Omit<
  IUserWithVirtual,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "firstName"
  | "lastName"
  | "username"
  | "profilePicture"
> & {
  _id: string;
  createdAt: string;
  profilePicture?: string | null;
};

export type { DeviceType, IHeaderRenderProps, ISafeUserType };
