const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // Either post or comment must be provided
    targetType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    reportReason: {
      type: String,
      enum: [
        "spam",
        "harassment",
        "hate_speech",
        "misinformation",
        "nsfw",
        "violence",
        "self_harm",
        "copyright",
        "other",
      ],
      required: true,
    },
    reportDetails: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, community: 1 });
reportSchema.index({ post: 1 });
reportSchema.index({ comment: 1 });

module.exports = mongoose.model("Report", reportSchema);
