import type mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId | string;
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

export interface IPublicUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture?: string;
  bio?: string;
}

export interface IPublicUserWithName extends IPublicUser {
  name: string;
}
