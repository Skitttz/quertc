import type mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  clerkUserId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithVirtual extends IUser {
  name: string;
}
