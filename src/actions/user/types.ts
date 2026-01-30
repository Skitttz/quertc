type UpdateUserInput<T> = {
  userId: string;
  payload: Partial<T>;
};

type AllowedUserFieldsUpdateType = "firstName" | "lastName" | "profilePicture";

type UpdateUserResult<T> = { data: T } | { error: string };

export type { AllowedUserFieldsUpdateType, UpdateUserInput, UpdateUserResult };
