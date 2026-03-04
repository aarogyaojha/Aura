const router = require("express").Router();
const passport = require("passport");
const decodeToken = require("../middlewares/auth/decodeToken");
const {
  getNotifications,
  markAsRead,
  markOneAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

router.use(passport.authenticate("jwt", { session: false }, null), decodeToken);

router.get("/", getNotifications);
router.patch("/mark-read", markAsRead);
router.patch("/:id/mark-read", markOneAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;
