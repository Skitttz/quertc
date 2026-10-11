interface IRequestUpdateProfile {
  firstName: string;
  lastName: string;
  bio: string;
}

type UpdateProfileResult =
  | { data: IRequestUpdateProfile & { name: string } }
  | { error: string };

export type { IRequestUpdateProfile, UpdateProfileResult };
