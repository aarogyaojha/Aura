import { API, handleApiError } from "./utils";

export const createPost = async (formData) => {
  try {
    const { data } = await API.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { error: null, data };
  } catch (error) {
    const { response } = error;
    if (response?.status === 403) {
      const { type, confirmationToken, info } = response.data || {};
      if (type === "inappropriateContent") {
        return { isInappropriate: true, data: null };
      } else if (type === "failedDetection") {
        return { confirmationToken, data: null };
      } else if (type === "categoryMismatch") {
        return { info, data: null };
      }
    }
    return handleApiError(error);
  }
};

export const confirmPost = async (confirmationToken) => {
  try {
    const { data } = await API.post(`/posts/confirm/${confirmationToken}`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const rejectPost = async (confirmationToken) => {
  try {
    const { data } = await API.post(`/posts/reject/${confirmationToken}`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getPost = async (id) => {
  try {
    const { data } = await API.get(`/posts/${id}`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getPosts = async (limit = 10, skip = 0, sort = "new") => {
  try {
    const { data } = await API.get(
      `/posts?limit=${limit}&skip=${skip}&sort=${sort}`
    );
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getComPosts = async (
  communityId,
  limit = 10,
  skip = 0,
  sort = "new"
) => {
  try {
    const { data } = await API.get(
      `/posts/community/${communityId}?limit=${limit}&skip=${skip}&sort=${sort}`
    );
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const deletePost = async (id) => {
  try {
    const { data } = await API.delete(`/posts/${id}`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const likePost = async (id) => {
  try {
    const { data } = await API.patch(`/posts/${id}/like`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const unlikePost = async (id) => {
  try {
    const { data } = await API.patch(`/posts/${id}/unlike`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const dislikePost = async (id) => {
  try {
    const { data } = await API.patch(`/posts/${id}/dislike`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const undislikePost = async (id) => {
  try {
    const { data } = await API.patch(`/posts/${id}/undislike`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const pinPost = async (id) => {
  try {
    const { data } = await API.patch(`/posts/${id}/pin`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const unpinPost = async (id) => {
  try {
    const { data } = await API.patch(`/posts/${id}/unpin`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const lockPost = async (id) => {
  try {
    const { data } = await API.patch(`/posts/${id}/lock`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const unlockPost = async (id) => {
  try {
    const { data } = await API.patch(`/posts/${id}/unlock`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateFlair = async (id, flair) => {
  try {
    const { data } = await API.patch(`/posts/${id}/flair`, { flair });
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const reportContent = async (id, reportData) => {
  try {
    const { data } = await API.post(`/posts/${id}/report`, reportData);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const likeComment = async (postId, commentId) => {
  try {
    const { data } = await API.patch(`/posts/${postId}/comment/${commentId}/like`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const dislikeComment = async (postId, commentId) => {
  try {
    const { data } = await API.patch(`/posts/${postId}/comment/${commentId}/dislike`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const addComment = async (id, newComment) => {
  try {
    const { data } = await API.post(`/posts/${id}/comment`, newComment);
    return { error: null, data };
  } catch (error) {
    if (error.response?.status === 403) {
      const { type } = error.response.data || {};
      if (type === "inappropriateContent") {
        return { error: "inappropriateContent" };
      }
    }
    return handleApiError(error);
  }
};


export const savePost = async (id) => {
  try {
    const { data } = await API.patch(`/posts/${id}/save`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const unsavePost = async (id) => {
  try {
    const { data } = await API.patch(`/posts/${id}/unsave`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getSavedPosts = async () => {
  try {
    const { data } = await API.get(`/posts/saved`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getPublicPosts = async (publicUserId) => {
  try {
    const { data } = await API.get(`/posts/${publicUserId}/userPosts`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getFollowingUsersPosts = async (communityId) => {
  try {
    const { data } = await API.get(`/posts/${communityId}/following`);

    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};
