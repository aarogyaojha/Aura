import axios from "axios";
import { NOTIFICATION_API, handleApiError } from "./utils";

export const getNotifications = async () => {
  try {
    const { data } = await NOTIFICATION_API.get("/");
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const markNotificationsAsRead = async () => {
  try {
    const { data } = await NOTIFICATION_API.patch("/mark-read");
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const markOneAsRead = async (id) => {
  try {
    const { data } = await NOTIFICATION_API.patch(`/${id}/mark-read`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteNotification = async (id) => {
  try {
    const { data } = await NOTIFICATION_API.delete(`/${id}`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};
