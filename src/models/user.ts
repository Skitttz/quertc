import mongoose from "mongoose";
import type { IUser } from "@/interfaces/user";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, required: false },
    bio: { type: String, required: false },
    contacts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
  },
  { timestamps: true },
);

const UserModel =
  (mongoose.models?.users as mongoose.Model<IUser>) ??
  mongoose.model<IUser>("users", userSchema);
const PUBLIC_USER_FIELDS = "firstName lastName username profilePicture bio";

export { PUBLIC_USER_FIELDS, UserModel };
