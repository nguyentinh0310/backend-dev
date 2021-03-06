import mongoose, { Document } from "mongoose";
import { IConversation } from "./conversations.interface";

const ConversationSchema = new mongoose.Schema(
  {
    recipients: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    text: String,
    media: Array,
    call: Object,
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IConversation & Document>("conversation", ConversationSchema);
