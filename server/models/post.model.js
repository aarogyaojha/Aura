const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const postSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    fileType: {
      type: String,
    },
    linkUrl: {
      type: String,
      trim: true,
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Cached counts for performance (denormalized)
    likeCount: {
      type: Number,
      default: 0,
    },
    dislikeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    // Post metadata
    flair: {
      type: String,
      trim: true,
      default: null,
    },
    isNSFW: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isSpoiler: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    // Content type
    postType: {
      type: String,
      enum: ["text", "image", "video", "link"],
      default: "text",
    },
    // For the "hot" sorting algorithm
    hotScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ content: "text", title: "text" });
postSchema.index({ community: 1, createdAt: -1 });
postSchema.index({ community: 1, hotScore: -1 });
postSchema.index({ community: 1, likeCount: -1 });
postSchema.index({ user: 1, createdAt: -1 });

/**
 * Calculate Reddit-style "hot" score
 * Based on Wilson score interval with boost for recency
 */
postSchema.methods.calculateHotScore = function () {
  const score = this.likeCount - this.dislikeCount;
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  const seconds =
    (this.createdAt.getTime() - new Date("2020-01-01").getTime()) / 1000;
  return sign * order + seconds / 45000;
};

postSchema.pre(["save", "findOneAndUpdate"], function (next) {
  if (this.likeCount !== undefined) {
    this.hotScore = this.calculateHotScore ? this.calculateHotScore() : 0;
  }
  next();
});

postSchema.pre("remove", async function (next) {
  try {
    if (this.fileUrl) {
      const filename = path.basename(this.fileUrl);
      const deleteFilePromise = promisify(fs.unlink)(
        path.join(__dirname, "../assets/userFiles", filename)
      );
      await deleteFilePromise.catch(() => {}); // non-critical
    }

    await this.model("Comment").deleteMany({ post: this._id });

    await this.model("Report").deleteMany({
      $or: [{ post: this._id }, { targetPost: this._id }],
    });

    await this.model("User").updateMany(
      { savedPosts: this._id },
      { $pull: { savedPosts: this._id } }
    );
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Post", postSchema);
