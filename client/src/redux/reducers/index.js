import { combineReducers } from "redux";

import postsReducer from "./posts";
import authReducer from "./auth";
import communityReducer from "./community";
import moderationReducer from "./moderation";
import userReducer from "./user";
import adminReducer from "./admin";
import notificationReducer from "./notification";

const rootReducer = combineReducers({
  posts: postsReducer,
  auth: authReducer,
  community: communityReducer,
  moderation: moderationReducer,
  user: userReducer,
  admin: adminReducer,
  notifications: notificationReducer,
});

export default rootReducer;
