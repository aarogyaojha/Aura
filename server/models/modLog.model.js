const mongoose = require("mongoose");

const modLogSchema = new mongoose.Schema(
  {
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
    action: {
      type: String,
      enum: [
        "remove_post",
        "restore_post",
        "remove_comment",
        "restore_comment",
        "ban_user",
        "unban_user",
        "approve_post",
        "reject_post",
        "pin_post",
        "unpin_post",
        "lock_post",
        "unlock_post",
        "approve_member",
        "reject_member",
        "add_moderator",
        "remove_moderator",
      ],
      required: true,
    },
    targetType: {
      type: String,
      enum: ["post", "comment", "user", "community"],
      required: true,
    },
    targetPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    targetComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

modLogSchema.index({ community: 1, createdAt: -1 });
modLogSchema.index({ moderator: 1, createdAt: -1 });

module.exports = mongoose.model("ModLog", modLogSchema);
