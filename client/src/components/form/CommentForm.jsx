import { useState, useEffect } from "react";
import {
  addCommentAction,
  getPostAction,
  getComPostsAction,
  getOwnPostAction,
  clearCommentFailAction,
} from "../../redux/actions/postActions";
import { useDispatch, useSelector } from "react-redux";
import InappropriatePost from "../modals/InappropriatePostModal";

const CommentForm = ({ communityId, postId, parentId = null, onSuccess, placeholder = "Write a comment...", isReply = false }) => {
  const dispatch = useDispatch();
  const [showInappropriateContentModal, setShowInappropriateContentModal] =
    useState(false);

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newComment = {
      content,
      postId,
      parentId, // Pass the parent ID if it's a reply
    };
    try {
      setIsLoading(true);
      await dispatch(addCommentAction(postId, newComment));
      await dispatch(getPostAction(postId));
      await dispatch(getOwnPostAction(postId));

      setIsLoading(false);
      setContent("");

      if (onSuccess) onSuccess(); // Notify parent component

      await dispatch(getComPostsAction(communityId));
    } finally {
      setIsLoading(false);
    }
  };

  const isCommentInappropriate = useSelector(
    (state) => state.posts?.isCommentInappropriate
  );

  useEffect(() => {
    if (isCommentInappropriate) {
      setShowInappropriateContentModal(true);
    }
  }, [isCommentInappropriate]);

  return (
    <div className={`w-full ${isReply ? "mb-2" : "mt-4"}`}>
      <InappropriatePost
        closeInappropriateContentModal={() => {
          setShowInappropriateContentModal(false);
          dispatch(clearCommentFailAction());
        }}
        showInappropriateContentModal={showInappropriateContentModal}
        contentType={"comment"}
      />

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="relative">
          <textarea
            autoFocus={isReply}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all ${
              isReply ? "text-sm min-h-[80px]" : "min-h-[100px]"
            }`}
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            required
            placeholder={placeholder}
          />
        </div>
        <div className="flex justify-end mt-2">
          <button
            className={`px-5 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : "shadow-sm hover:shadow-md cursor-pointer"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Posting...
              </>
            ) : isReply ? "Reply" : "Post Comment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
