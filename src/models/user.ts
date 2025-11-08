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
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, required: false },
    bio: { type: String, required: false },
  },
  { timestamps: true },
);

if (mongoose.models?.users) {
  mongoose.deleteModel("users");
}

const UserModel = mongoose.model<IUser>("users", userSchema);
export { UserModel };
