import mongoose from "mongoose";
import { IUser } from "./users.interface";

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    account: {
      type: String,
      required: [true, "Please add your email or phone"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dwgximj2j/image/upload/v1650776061/avatars/avatar_d8bwej.jpg",
    },
    coverImg: {
      type: String,
      default:
        "https://res.cloudinary.com/dwgximj2j/image/upload/v1649480694/avatars/dev-cover_utacnt.jpg",
    },
    gender: { type: String, default: "male" },
    role: {
      type: Number,
      default: 0, // 0: user, 1: admin
    },
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    friends: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    friend_requests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    saved: [{ type: mongoose.Types.ObjectId, ref: "post" }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser & mongoose.Document>("user", UserSchema);
