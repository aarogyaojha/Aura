/**
 * CommentVoteButtons — Simplified voting for comments
 *
 * Props:
 *   comment – comment object
 *   postId  – parent post ID
 */
import { useState, useEffect } from "react";
import { HiHandThumbUp, HiOutlineHandThumbUp, HiHandThumbDown, HiOutlineHandThumbDown } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { likeCommentAction, dislikeCommentAction } from "../../redux/actions/postActions";
import { cn } from "@/lib/utils";

const CommentVoteButtons = ({ comment, postId }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth?.userData);
  const { _id, likes = [], dislikes = [] } = comment;

  const [vote, setVote] = useState(() => {
    if (likes.includes?.(userData?._id)) return "up";
    if (dislikes.includes?.(userData?._id)) return "down";
    return null;
  });

  const [score, setScore] = useState(likes.length - dislikes.length);

  useEffect(() => {
    if (likes.includes?.(userData?._id)) setVote("up");
    else if (dislikes.includes?.(userData?._id)) setVote("down");
    else setVote(null);

    setScore(likes.length - dislikes.length);
  }, [comment, userData?._id]);

  const handleUpvote = (e) => {
    e.preventDefault();
    if (vote === "up") {
      setVote(null);
      setScore((s) => s - 1);
    } else {
      const delta = vote === "down" ? 2 : 1;
      setVote("up");
      setScore((s) => s + delta);
    }
    dispatch(likeCommentAction(postId, _id));
  };

  const handleDownvote = (e) => {
    e.preventDefault();
    if (vote === "down") {
      setVote(null);
      setScore((s) => s + 1);
    } else {
      const delta = vote === "up" ? 2 : 1;
      setVote("down");
      setScore((s) => s - delta);
    }
    dispatch(dislikeCommentAction(postId, _id));
  };

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={handleUpvote}
        className={cn(
          "p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors",
          vote === "up" ? "text-orange-500" : "text-muted-foreground"
        )}
      >
        {vote === "up" ? <HiHandThumbUp size={16} /> : <HiOutlineHandThumbUp size={16} />}
      </button>
      
      <span className={cn(
        "text-xs font-bold min-w-[12px] text-center",
        vote === "up" ? "text-orange-500" : vote === "down" ? "text-blue-500" : "text-muted-foreground"
      )}>
        {score === 0 ? "Vote" : score}
      </span>

      <button
        onClick={handleDownvote}
        className={cn(
          "p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors",
          vote === "down" ? "text-blue-500" : "text-muted-foreground"
        )}
      >
        {vote === "down" ? <HiHandThumbDown size={16} /> : <HiOutlineHandThumbDown size={16} />}
      </button>
    </div>
  );
};

export default CommentVoteButtons;
