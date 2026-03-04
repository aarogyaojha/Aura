import { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageSquare, Reply, ChevronDown, ChevronUp, Flag, ShieldAlert } from "lucide-react";
import CommentForm from "../form/CommentForm";
import CommentVoteButtons from "./CommentVoteButtons";
import { cn } from "@/lib/utils";

const ThreadedComment = ({ comment, communityId, postId, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const toggleReply = () => setIsReplying(!isReplying);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleReplies = () => setShowReplies(!showReplies);

  const handleReplySuccess = () => {
    setIsReplying(false);
    setShowReplies(true);
  };

  const maxDepth = 6;
  const hasReplies = comment.replies?.length > 0;
  
  // Moderation / Logic states
  const isDeleted = comment.isDeleted; // User deleted
  const isRemoved = comment.isRemoved; // Mod removed
  const displayContent = isRemoved 
    ? "[removed by moderator]" 
    : isDeleted 
    ? "[deleted]" 
    : comment.content;

  return (
    <div className={cn("flex flex-col w-full", depth > 0 ? "mt-3" : "mt-6")}>
      <div className="flex gap-3">
        {/* Thread Line */}
        {depth > 0 && (
          <div 
            className="flex flex-col items-center group cursor-pointer" 
            onClick={toggleCollapse}
          >
            <div className={cn(
              "w-[2px] h-full transition-colors",
              isCollapsed ? "bg-transparent" : "bg-border group-hover:bg-primary/50"
            )} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            {!isDeleted && !isRemoved ? (
              <img
                src={comment.user?.avatar}
                alt={comment.user?.name}
                className="rounded-full w-7 h-7 object-cover border bg-muted flex-shrink-0 mt-0.5"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                 <ShieldAlert size={14} className="text-muted-foreground/50" />
              </div>
            )}
            
            <div className={cn(
              "flex flex-col flex-1 min-w-0",
              isCollapsed && "opacity-50"
            )}>
              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                {!isDeleted && !isRemoved ? (
                  <Link 
                    to={`/user/${comment.user?._id}`}
                    className="text-xs font-bold hover:underline"
                  >
                    u/{comment.user?.name}
                  </Link>
                ) : (
                  <span className="text-xs font-bold text-muted-foreground italic">
                    {isRemoved ? "[moderator]" : "[deleted]"}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground">
                  {comment.createdAt}
                </span>
                
                {isRemoved && <ShieldAlert size={12} className="text-orange-500" />}

                <button 
                  onClick={toggleCollapse}
                  className="ml-auto text-muted-foreground hover:text-foreground p-0.5"
                >
                  {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
              </div>

              {!isCollapsed && (
                <>
                  <div className={cn(
                    "text-sm prose dark:prose-invert prose-compact max-w-none break-words",
                    (isRemoved || isDeleted) && "italic text-muted-foreground font-medium"
                  )}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {displayContent}
                    </ReactMarkdown>
                  </div>

                  {/* Actions */}
                  {!isRemoved && !isDeleted && (
                    <div className="flex items-center gap-4 mt-2">
                      <CommentVoteButtons comment={comment} postId={postId} />
                      
                      <button
                        onClick={toggleReply}
                        className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:bg-muted px-2 py-1 rounded"
                      >
                        <Reply size={14} />
                        {isReplying ? "Cancel" : "Reply"}
                      </button>

                      <button className="text-muted-foreground hover:text-orange-500 transition-colors">
                        <Flag size={14} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {!isCollapsed && (
            <div className="ml-4 mt-2">
              {isReplying && (
                <div className="mb-4 pl-4 border-l-2">
                   <CommentForm 
                    communityId={communityId} 
                    postId={postId} 
                    parentId={comment._id} 
                    onSuccess={handleReplySuccess}
                    placeholder={`Reply to ${comment.user?.name}...`}
                    isReply
                  />
                </div>
              )}

              {hasReplies && showReplies && (
                <div className={cn(
                  "mt-2",
                  depth < maxDepth ? "pl-2 border-l-2" : "pl-0"
                )}>
                  {comment.replies.map((reply) => (
                    <ThreadedComment
                      key={reply._id}
                      comment={reply}
                      communityId={communityId}
                      postId={postId}
                      depth={depth + 1}
                    />
                  ))}
                </div>
              )}
              
              {hasReplies && !showReplies && (
                <button 
                  onClick={toggleReplies}
                  className="text-[11px] font-bold text-primary hover:underline mt-2 flex items-center gap-1"
                >
                  <MessageSquare size={12} />
                  Show {comment.replies.length} more replies
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadedComment;
