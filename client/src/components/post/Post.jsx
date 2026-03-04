import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  HiOutlineChatBubbleOvalLeft,
  HiOutlineArchiveBox,
  HiOutlineEye,
} from "react-icons/hi2";
import { Pin, ShieldAlert, BadgeCheck } from "lucide-react";
import DeleteModal from "../modals/DeleteModal";
import VoteButtons from "./VoteButtons";
import "react-photo-view/dist/react-photo-view.css";
import Tooltip from "../shared/Tooltip";
import { cn } from "@/lib/utils";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.auth?.userData);

  const {
    _id,
    title,
    content,
    fileUrl,
    fileType,
    user,
    community,
    createdAt,
    comments = [],
    isPinned,
    isNSFW,
    isFlair,
    views = 0,
    isLocked,
  } = post;

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (value) => {
    setShowModal(value);
  };

  const goToPost = () => {
    navigate(`/post/${_id}`, {
      state: { from: location.pathname },
    });
  };

  return (
    <div className="border rounded-xl bg-card text-card-foreground m-2 hover:shadow-md transition-shadow duration-300 overflow-hidden flex">
      {/* Side Voting Column (Reddit style) */}
      <div className="bg-muted/30 p-2 flex flex-col items-center border-r w-12 pt-4">
        <VoteButtons post={post} vertical={true} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Link to={`/community/${community?.name}`} className="font-bold text-xs hover:underline">
              r/{community?.name}
            </Link>
            <span className="text-muted-foreground text-xs">•</span>
            <div className="flex items-center gap-1 group">
              <img
                className="rounded-full overflow-hidden w-5 h-5 object-cover"
                src={user?.avatar}
                alt={user?.name}
                loading="lazy"
              />
              <Link
                to={userData?._id === user?._id ? "/profile" : `/user/${user?._id}`}
                className="text-xs text-muted-foreground group-hover:underline"
              >
                u/{user?.name}
              </Link>
            </div>
            <span className="text-muted-foreground text-xs">•</span>
            <p className="text-xs text-muted-foreground truncate max-w-[100px]">{createdAt}</p>
            
            {/* Badges */}
            <div className="flex items-center gap-1 ml-2">
              {isPinned && (
                <Tooltip text="Pinned by moderators">
                  <Pin className="h-3 w-3 text-green-500 fill-green-500" />
                </Tooltip>
              )}
              {isLocked && (
                <Tooltip text="Thread is locked">
                  <ShieldAlert className="h-3 w-3 text-orange-500" />
                </Tooltip>
              )}
              {isNSFW && (
                <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-1 rounded border border-destructive/20 ml-1">
                  NSFW
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Post Title & Content */}
        <div className="space-y-2">
          {title && (
            <h3 
              onClick={goToPost}
              className="font-semibold text-lg leading-snug cursor-pointer hover:text-primary transition-colors pr-2"
            >
              {title}
            </h3>
          )}
          
          {isFlair && (
            <div className="inline-block bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-primary/20">
              {isFlair}
            </div>
          )}

          <div
            onClick={goToPost}
            className="text-sm prose dark:prose-invert prose-compact max-w-none cursor-pointer line-clamp-3 mb-3"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>

          {/* Media Section */}
          <div className="mt-3 bg-muted/20 rounded-lg overflow-hidden border">
            {fileUrl && fileType === "image" ? (
              <PhotoProvider
                overlayRender={() => (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 backdrop-blur-sm">
                    <p className="text-sm font-bold">{title || "Post Image"}</p>
                    <p className="text-xs opacity-80">Posted by u/{user?.name} in r/{community?.name}</p>
                  </div>
                )}
              >
                <PhotoView src={fileUrl}>
                  <img
                    src={fileUrl}
                    alt={content}
                    loading="lazy"
                    className="w-full max-h-[512px] object-contain bg-black/5 cursor-zoom-in"
                  />
                </PhotoView>
              </PhotoProvider>
            ) : (
              fileUrl && (
                <video
                  className="w-full max-h-[512px] bg-black/5 focus:outline-none"
                  src={fileUrl}
                  controls
                />
              )
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <button
              className="flex items-center text-xs font-bold gap-1.5 p-2 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              onClick={goToPost}
            >
              <HiOutlineChatBubbleOvalLeft className="text-lg" />
              <span>{comments.length} Comments</span>
            </button>
            
            <div className="flex items-center text-xs gap-1.5 p-2 text-muted-foreground">
              <HiOutlineEye className="text-lg" />
              <span>{views} views</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userData?._id === post.user?._id && (
              <Tooltip text="Delete post">
                <button
                  onClick={() => toggleModal(true)}
                  className="p-2 rounded hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <HiOutlineArchiveBox className="text-xl" />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <DeleteModal
          showModal={showModal}
          postId={post._id}
          onClose={() => toggleModal(false)}
          prevPath={location.pathname}
        />
      )}
    </div>
  );
};


export default Post;
