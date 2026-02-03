import type { IChat } from "@/interfaces/chat";
import mongoose from "mongoose";

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
    unreadCounts: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

if (mongoose.models?.chats) {
  mongoose.deleteModel("chats");
}

const ChatModel = mongoose.model<IChat>("chats", chatSchema);
export { ChatModel };
