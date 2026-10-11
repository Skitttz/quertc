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
    reactions: {
      type: [
        {
          _id: false,
          user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
          emoji: String,
        },
      ],
      default: [],
    },
    mentions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    editedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

messageSchema.index({ chat: 1, createdAt: -1 });

const MessageModel =
  (mongoose.models?.messages as mongoose.Model<IMessage>) ??
  mongoose.model<IMessage>("messages", messageSchema);
export { MessageModel };
