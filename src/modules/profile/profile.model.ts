import mongoose, { Document } from "mongoose";
import { IProfile } from "./profile.interface";

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    skills: {
      type: [String],
    },
  
    experiences: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
        },
        location: {
          type: String,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    educations: [
      {
        school: {
          type: String,
          required: true,
        },
        fieldofstudy: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    socail: {
      youtube: {
        type: String,
      },
      twitter: {
        type: String,
      },
      facebook: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      instagram: {
        type: String,
      },
      github: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile & Document>("profile", ProfileSchema);
