import mongoose from "mongoose";
import type { IMessage } from "@/interfaces/message";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    readBy: { type: [mongoose.Schema.Types.ObjectId], ref: "users" },
  },
  { timestamps: true },
);

const MessageModel =
  (mongoose.models?.messages as mongoose.Model<IMessage>) ??
  mongoose.model<IMessage>("messages", messageSchema);
export { MessageModel };
