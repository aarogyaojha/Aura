const router = require("express").Router();
const passport = require("passport");

const {
  getPublicPosts,
  getPosts,
  getPost,
  createPost,
  confirmPost,
  rejectPost,
  deletePost,
  getCommunityPosts,
  getFollowingUsersPosts,
  likePost,
  unlikePost,
  dislikePost,
  undislikePost,
  addComment,
  savePost,
  unsavePost,
  getSavedPosts,
  clearPendingPosts,
  pinPost,
  unpinPost,
  lockPost,
  unlockPost,
  updateFlair,
  reportContent,
  likeComment,
  dislikeComment,
} = require("../controllers/post.controller");

const {
  postValidator,
  commentValidator,
  validatorHandler,
} = require("../middlewares/post/userInputValidator");

const {
  createPostLimiter,
  likeSaveLimiter,
  commentLimiter,
} = require("../middlewares/limiter/limiter");

const postConfirmation = require("../middlewares/post/postConfirmation");
const analyzeContent = require("../services/analyzeContent");
const processPost = require("../services/processPost");
const fileUpload = require("../middlewares/post/fileUpload");
const decodeToken = require("../middlewares/auth/decodeToken");

const requireAuth = passport.authenticate("jwt", { session: false }, null);

router.use(requireAuth, decodeToken);

// ── GET ─────────────────────────────────────────────────────────────────────
router.get("/community/:communityId", getCommunityPosts);
router.get("/saved", getSavedPosts);
router.get("/:publicUserId/userPosts", getPublicPosts);
router.get("/:id/following", getFollowingUsersPosts);
router.get("/:id", getPost);
router.get("/", getPosts);

// ── Post confirmation flow ──────────────────────────────────────────────────
router.post("/confirm/:confirmationToken", confirmPost);
router.post("/reject/:confirmationToken", rejectPost);

// ── Create post ─────────────────────────────────────────────────────────────
router.post(
  "/",
  createPostLimiter,
  fileUpload,
  postValidator,
  validatorHandler,
  analyzeContent,
  processPost,
  postConfirmation,
  createPost
);

// ── Comments ─────────────────────────────────────────────────────────────────
router.post(
  "/:id/comment",
  commentLimiter,
  commentValidator,
  validatorHandler,
  analyzeContent,
  addComment
);

// ── Comment voting ───────────────────────────────────────────────────────────
router.use(likeSaveLimiter);
router.patch("/:id/comment/:commentId/like", likeComment);
router.patch("/:id/comment/:commentId/dislike", dislikeComment);

// ── Reporting ────────────────────────────────────────────────────────────────
router.post("/:id/report", reportContent);

// ── Delete ───────────────────────────────────────────────────────────────────
router.delete("/pending", clearPendingPosts);
router.delete("/:id", deletePost);

// ── Voting (like / dislike) ──────────────────────────────────────────────────
router.patch("/:id/save", savePost);
router.patch("/:id/unsave", unsavePost);
router.patch("/:id/like", likePost);
router.patch("/:id/unlike", unlikePost);
router.patch("/:id/dislike", dislikePost);
router.patch("/:id/undislike", undislikePost);

// ── Moderation ───────────────────────────────────────────────────────────────
router.patch("/:id/pin", pinPost);
router.patch("/:id/unpin", unpinPost);
router.patch("/:id/lock", lockPost);
router.patch("/:id/unlock", unlockPost);
router.patch("/:id/flair", updateFlair);

module.exports = router;
