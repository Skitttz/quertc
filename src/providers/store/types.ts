import type { IUserClient } from "@/utils/serialize/user/types";

export interface IStoreProviderProps {
  children: React.ReactNode;
  user: IUserClient | null;
}
