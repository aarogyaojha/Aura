import * as types from "../constants/notificationConstants";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.isRead).length,
        loading: false,
        error: null,
      };
    case types.GET_NOTIFICATIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.MARK_NOTIFICATIONS_READ_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      };
    case types.DELETE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.filter((n) => n._id !== action.payload),
        unreadCount: state.notifications.find((n) => n._id === action.payload)?.isRead 
          ? state.unreadCount 
          : state.unreadCount - 1,
      };
    default:
      return state;
  }
};

export default notificationReducer;
