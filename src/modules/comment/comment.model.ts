import mongoose from "mongoose";
import { IComment } from "./comment.interface";

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tag: Object,
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    postId: mongoose.Types.ObjectId,
    reply: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IComment & mongoose.Document>("comment", CommentSchema);
