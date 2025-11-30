export interface IUserClient {
  _id: string;
  clerkUserId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  name: string;
  email: string;
  profilePicture?: string | null;
  createdAt: string;
  updatedAt: string;
}
