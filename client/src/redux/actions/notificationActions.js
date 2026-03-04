import * as api from "../api/notificationAPI";
import * as types from "../constants/notificationConstants";

export const getNotificationsAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getNotifications();
    if (error) throw new Error(error);
    dispatch({
      type: types.GET_NOTIFICATIONS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_NOTIFICATIONS_FAIL,
      payload: error.message,
    });
  }
};

export const markNotificationsReadAction = () => async (dispatch) => {
  try {
    const { error } = await api.markNotificationsAsRead();
    if (error) throw new Error(error);
    dispatch({
      type: types.MARK_NOTIFICATIONS_READ_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: types.MARK_NOTIFICATIONS_READ_FAIL,
      payload: error.message,
    });
  }
};

export const markOneReadAction = (id) => async (dispatch) => {
  try {
    const { error } = await api.markOneAsRead(id);
    if (error) throw new Error(error);
    dispatch(getNotificationsAction());
  } catch (error) {
    console.error(error);
  }
};

export const deleteNotificationAction = (id) => async (dispatch) => {
  try {
    const { error } = await api.deleteNotification(id);
    if (error) throw new Error(error);
    dispatch({
      type: types.DELETE_NOTIFICATION_SUCCESS,
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: types.DELETE_NOTIFICATION_FAIL,
      payload: error.message,
    });
  }
};
