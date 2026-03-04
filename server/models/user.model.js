const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    banner: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    location: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    website: {
      type: String,
      default: "",
    },
    interests: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["general", "moderator", "admin"],
      default: "general",
    },
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // Karma system
    postKarma: {
      type: Number,
      default: 0,
    },
    commentKarma: {
      type: Number,
      default: 0,
    },
    // Account status
    isBanned: {
      type: Boolean,
      default: false,
    },
    banReason: {
      type: String,
      default: null,
    },
    bannedUntil: {
      type: Date,
      default: null,
    },
    // Preferences
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    showNSFW: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ name: "text", username: "text" });
userSchema.index({ email: 1 });

// Virtual: total karma
userSchema.virtual("karma").get(function () {
  return this.postKarma + this.commentKarma;
});

module.exports = mongoose.model("User", userSchema);
