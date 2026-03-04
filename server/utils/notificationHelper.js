const Notification = require("../models/notification.model");
const socket = require("./socket");

/**
 * Creates a notification in the database and sends it via socket if the user is online.
 */
const createAndSendNotification = async (notifData) => {
  try {
    const notification = new Notification(notifData);
    await notification.save();

    // Populate sender and other details before sending
    const populatedNotif = await Notification.findById(notification._id)
      .populate("sender", "name avatar")
      .populate("post", "content")
      .populate("community", "name")
      .lean();

    socket.getIO().to(notifData.recipient.toString()).emit("newNotification", populatedNotif);

    return notification;
  } catch (err) {
    console.error("Error creating/sending notification:", err);
  }
};

/**
 * Sends multiple notifications at once.
 */
const sendBulkNotifications = async (notifications) => {
  try {
    const savedNotifications = await Notification.insertMany(notifications);
    
    for (const notif of savedNotifications) {
      const populatedNotif = await Notification.findById(notif._id)
        .populate("sender", "name avatar")
        .populate("post", "content")
        .populate("community", "name")
        .lean();
      
      socket.getIO().to(notif.recipient.toString()).emit("newNotification", populatedNotif);
    }
  } catch (err) {
    console.error("Error creating/sending bulk notifications:", err);
  }
};

module.exports = {
  createAndSendNotification,
  sendBulkNotifications
};
