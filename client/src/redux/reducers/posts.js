import * as types from "../constants/postConstants";
import { LOGOUT, SET_USER_DATA } from "../constants/authConstants";

const initialState = {
  post: null,
  posts: [],
  publicPosts: [],
  ownPost: null,
  savedPosts: [],
  totalPosts: 0,
  communityPosts: [],
  followingUsersPosts: [],
  totalCommunityPosts: 0,
  postError: null,
  postCategory: null,
  confirmationToken: null,
  isPostInappropriate: false,
  isCommentInappropriate: false,
  currentSort: "new",
  communitySort: "new",
};

const postsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGOUT:
      return {
        ...state,
        post: null,
        posts: [],
        publicPosts: [],
        ownPost: null,
        savedPosts: [],
        totalPosts: 0,
        communityPosts: [],
        followingUsersPosts: [],
        totalCommunityPosts: 0,
        postError: null,
        commentError: null,
        postCategory: null,
        confirmationToken: null,
        isPostInappropriate: false,
        isCommentInappropriate: false,
      };

    case SET_USER_DATA:
      if (!payload) return state;
      const updatePostUser = (post) => {
        if (post.user && (post.user._id === payload._id || post.user === payload._id)) {
          return {
            ...post,
            user: {
              ...post.user,
              name: payload.name,
              avatar: payload.avatar,
            }
          };
        }
        return post;
      };
      return {
        ...state,
        posts: state.posts.map(updatePostUser),
        publicPosts: state.publicPosts.map(updatePostUser),
        ownPost: state.ownPost ? updatePostUser(state.ownPost) : null,
        savedPosts: state.savedPosts.map(updatePostUser),
        communityPosts: state.communityPosts.map(updatePostUser),
        followingUsersPosts: state.followingUsersPosts.map(updatePostUser),
        post: state.post ? updatePostUser(state.post) : null,
      };

    case types.CREATE_POST_SUCCESS:
    case types.CONFIRM_POST_SUCCESS:
      return {
        ...state,
        posts: [payload, ...state.posts],
        communityPosts: [payload, ...state.communityPosts],
        postError: null,
        postCategory: null,
        confirmationToken: null,
        isPostInappropriate: false,
      };

    case types.CREATE_POST_FAIL:
    case types.CONFIRM_POST_FAIL:
      return {
        ...state,
        postError: payload,
      };

    case types.CREATE_POST_FAIL_INAPPROPRIATE:
      return {
        ...state,
        isPostInappropriate: true,
      };

    case types.CREATE_POST_FAIL_DETECT_CATEGORY:
      return {
        ...state,
        confirmationToken: payload,
      };

    case types.CREATE_POST_FAIL_CATEGORY_MISMATCH:
      return {
        ...state,
        postCategory: payload,
      };

    case types.CLEAR_CREATE_POST_FAIL:
      return {
        ...state,
        postError: null,
        postCategory: null,
        confirmationToken: null,
        isPostInappropriate: false,
      };

    case types.GET_POST_SUCCESS:
      return {
        ...state,
        post: payload,
        postError: null,
      };
    case types.GET_POST_FAIL:
      return {
        ...state,
        postError: payload,
      };

    case types.GET_OWN_POST_SUCCESS:
      return {
        ...state,
        ownPost: payload,
        postError: null,
      };
    case types.GET_OWN_POST_FAIL:
      return {
        ...state,
        postError: payload,
      };

    case types.CLEAR_POST:
      return {
        ...state,
        post: null,
        comments: [],
      };

    case types.CLEAR_POSTS:
      return {
        ...state,
        posts: [],
        totalPosts: 0,
      };

    case types.CLEAR_COMMUNITY_POSTS:
      return {
        ...state,
        communityPosts: [],
        totalCommunityPosts: 0,
      };

    case types.LIKE_POST_SUCCESS:
    case types.UNLIKE_POST_SUCCESS:
    case types.DISLIKE_POST_SUCCESS:
    case types.UNDISLIKE_POST_SUCCESS:
    case types.PIN_POST_SUCCESS:
    case types.UNPIN_POST_SUCCESS:
    case types.LOCK_POST_SUCCESS:
    case types.UNLOCK_POST_SUCCESS:
    case types.UPDATE_FLAIR_SUCCESS:
      return updatePostInState(state, payload);

    case types.LIKE_POST_FAIL:
    case types.UNLIKE_POST_FAIL:
    case types.DISLIKE_POST_FAIL:
    case types.UNDISLIKE_POST_FAIL:
      return {
        ...state,
        postError: payload,
      };

    case types.LIKE_COMMENT_SUCCESS:
    case types.DISLIKE_COMMENT_SUCCESS:
      // payload is { postId, data: updatedPost }
      return updatePostInState(state, payload.data);

    case types.GET_POSTS_SUCCESS:
      if (payload.page === 1) {
        return {
          ...state,
          posts: payload ? payload.posts : [],
          totalPosts: payload ? payload.totalPosts : 0,
          currentSort: payload.sort || state.currentSort,
          postError: null,
        };
      } else {
        const existingPosts = state.posts.map((post) => post._id);
        const newPosts = (payload ? payload.posts : []).filter(
          (post) => !existingPosts.includes(post._id)
        );
        return {
          ...state,
          posts: [...state.posts, ...newPosts],
          totalPosts: payload ? payload.totalPosts : 0,
          currentSort: payload.sort || state.currentSort,
          postError: null,
        };
      }

    case types.GET_COMMUNITY_POSTS_SUCCESS:
      if (payload.page === 1) {
        return {
          ...state,
          communityPosts: payload ? payload.posts : [],
          totalCommunityPosts: payload ? payload.totalCommunityPosts : 0,
          communitySort: payload.sort || state.communitySort,
          postError: null,
        };
      } else {
        return {
          ...state,
          communityPosts: [
            ...state.communityPosts,
            ...(payload ? payload.posts : []),
          ],
          totalCommunityPosts: payload ? payload.totalCommunityPosts : 0,
          communitySort: payload.sort || state.communitySort,
          postError: null,
        };
      }

    case types.SAVE_POST_SUCCESS:
    case types.UNSAVE_POST_SUCCESS:
    case types.GET_SAVED_POSTS_SUCCESS:
      return {
        ...state,
        savedPosts: payload ? payload : [],
        postError: null,
      };

    case types.DEFAULT:
    default:
      return state;
  }
};

const updatePostInState = (state, updatedPost) => {
  const update = (post) => (post._id === updatedPost._id ? updatedPost : post);
  return {
    ...state,
    posts: state.posts.map(update),
    communityPosts: state.communityPosts.map(update),
    publicPosts: state.publicPosts.map(update),
    savedPosts: state.savedPosts.map(update),
    followingUsersPosts: state.followingUsersPosts.map(update),
    post: state.post && state.post._id === updatedPost._id ? updatedPost : state.post,
    ownPost: state.ownPost && state.ownPost._id === updatedPost._id ? updatedPost : state.ownPost,
    postError: null,
  };
};

export default postsReducer;
