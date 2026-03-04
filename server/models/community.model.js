const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    banner: {
      type: String,
    },
    icon: {
      type: String,
    },
    moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    bannedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    rules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rule",
        default: [],
      },
    ],
    // Community type
    type: {
      type: String,
      enum: ["public", "restricted", "private"],
      default: "public",
    },
    // Pending membership requests (for private/restricted communities)
    pendingMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    // Community flairs (predefined by moderators)
    flairs: [
      {
        type: String,
        trim: true,
      },
    ],
    // Community stats (denormalized for performance)
    memberCount: {
      type: Number,
      default: 0,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isNSFW: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

communitySchema.index({ name: "text", description: "text" });
communitySchema.index({ memberCount: -1 });

module.exports = mongoose.model("Community", communitySchema);
