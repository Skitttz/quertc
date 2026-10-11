import mongoose from "mongoose";
import type { IChat } from "@/interfaces/chat";

const chatSchema = new mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: "",
    },
    groupProfilePicture: {
      type: String,
      default: "",
    },
    groupBio: {
      type: String,
      default: "",
    },
    groupAdmins: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
    pinnedMessages: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "messages",
      default: [],
    },
    hiddenFor: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    clearedAt: {
      type: Map,
      of: Date,
      default: {},
    },
  },
  { timestamps: true },
);

chatSchema.index({ users: 1, updatedAt: -1 });

const ChatModel =
  (mongoose.models?.chats as mongoose.Model<IChat>) ??
  mongoose.model<IChat>("chats", chatSchema);
export { ChatModel };
