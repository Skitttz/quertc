import type mongoose from "mongoose";

export interface IPushSubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export interface IUser {
  _id: mongoose.Types.ObjectId | string;
  clerkUserId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  contacts?: string[];
  doNotDisturb?: boolean;
  pushSubscriptions?: IPushSubscription[];
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

export interface IUserSearchResult extends IPublicUserWithName {
  isContact: boolean;
}
