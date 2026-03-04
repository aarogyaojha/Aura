/**
 * VoteButtons — replaces the bare Like component with
 * upvote + downvote + score display (Reddit-style).
 *
 * Props:
 *   post       – post object from Redux store
 *   vertical   – if true, stacks buttons vertically (like Reddit sidebar)
 */
import { useState, useEffect } from "react";
import { HiHandThumbUp, HiOutlineHandThumbUp, HiHandThumbDown, HiOutlineHandThumbDown } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { likePostAction, unlikePostAction } from "../../redux/actions/postActions";
import { dislikePostAction, undislikePostAction } from "../../redux/actions/postActions";
import { cn } from "@/lib/utils";

const VoteButtons = ({ post, vertical = false, size = "md" }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth?.userData);
  const { _id, likes = [], dislikes = [], likeCount = 0, dislikeCount = 0 } = post;

  const [vote, setVote] = useState(() => {
    if (likes.includes?.(userData?._id)) return "up";
    if (dislikes.includes?.(userData?._id)) return "down";
    return null;
  });

  const [score, setScore] = useState(
    (likeCount || likes.length) - (dislikeCount || dislikes.length)
  );

  useEffect(() => {
    if (likes.includes?.(userData?._id)) setVote("up");
    else if (dislikes.includes?.(userData?._id)) setVote("down");
    else setVote(null);

    setScore((likeCount || likes.length) - (dislikeCount || dislikes.length));
  }, [post, userData?._id]);

  const handleUpvote = async (e) => {
    e.preventDefault();
    const prev = vote;
    if (vote === "up") {
      setVote(null);
      setScore((s) => s - 1);
      dispatch(unlikePostAction(_id));
    } else {
      const delta = vote === "down" ? 2 : 1;
      setVote("up");
      setScore((s) => s + delta);
      if (vote === "down") dispatch(undislikePostAction?.(_id));
      dispatch(likePostAction(_id));
    }
  };

  const handleDownvote = async (e) => {
    e.preventDefault();
    if (vote === "down") {
      setVote(null);
      setScore((s) => s + 1);
      dispatch(undislikePostAction?.(_id));
    } else {
      const delta = vote === "up" ? 2 : 1;
      setVote("down");
      setScore((s) => s - delta);
      if (vote === "up") dispatch(unlikePostAction(_id));
      dispatch(dislikePostAction?.(_id));
    }
  };

  const iconSize = size === "sm" ? "text-base" : "text-xl";
  const scoreColor =
    vote === "up"
      ? "text-orange-500 font-bold"
      : vote === "down"
      ? "text-blue-500 font-bold"
      : "text-muted-foreground font-semibold";

  if (vertical) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <button
          onClick={handleUpvote}
          aria-label="Upvote"
          className={cn(
            "p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors",
            vote === "up" && "text-orange-500"
          )}
        >
          {vote === "up" ? (
            <HiHandThumbUp className={iconSize} />
          ) : (
            <HiOutlineHandThumbUp className={iconSize} />
          )}
        </button>
        <span className={cn("text-sm", scoreColor)}>{score}</span>
        <button
          onClick={handleDownvote}
          aria-label="Downvote"
          className={cn(
            "p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors",
            vote === "down" && "text-blue-500"
          )}
        >
          {vote === "down" ? (
            <HiHandThumbDown className={iconSize} />
          ) : (
            <HiOutlineHandThumbDown className={iconSize} />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleUpvote}
        aria-label="Upvote"
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors text-sm",
          vote === "up" && "text-orange-500"
        )}
      >
        {vote === "up" ? (
          <HiHandThumbUp className={iconSize} />
        ) : (
          <HiOutlineHandThumbUp className={iconSize} />
        )}
        <span className={scoreColor}>{score}</span>
      </button>
      <button
        onClick={handleDownvote}
        aria-label="Downvote"
        className={cn(
          "p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors",
          vote === "down" && "text-blue-500"
        )}
      >
        {vote === "down" ? (
          <HiHandThumbDown className={iconSize} />
        ) : (
          <HiOutlineHandThumbDown className={iconSize} />
        )}
      </button>
    </div>
  );
};

export default VoteButtons;
