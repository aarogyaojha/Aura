import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  HiOutlineChatBubbleOvalLeft, 
  HiOutlineArchiveBox,
  HiOutlineEye,
  HiOutlineBookmark,
  HiBookmark
} from "react-icons/hi2";
import { IoIosArrowBack } from "react-icons/io";
import { Pin, ShieldAlert, Flag, Trash2, Share2 } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";

import { getCommunityAction } from "../../redux/actions/communityActions";
import { savePostAction, unsavePostAction } from "../../redux/actions/postActions";
import CommentForm from "../form/CommentForm";
import VoteButtons from "./VoteButtons";
import ThreadedComment from "./ThreadedComment";
import CommonLoading from "../loader/CommonLoading";
import DeleteModal from "../modals/DeleteModal";
import ReportPostModal from "../modals/ReportPostModal";
import Tooltip from "../shared/Tooltip";
import { cn } from "@/lib/utils";

import "react-photo-view/dist/react-photo-view.css";

const PostView = ({ post }) => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    isReported,
    savedBy = [],
  } = post;

  const isSaved = savedBy.includes(userData?._id);

  useEffect(() => {
    if (community?.name) {
      dispatch(getCommunityAction(community.name)).then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, community?.name]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportedPost, setIsReportedPost] = useState(isReported);

  const handleSave = () => {
    if (isSaved) dispatch(unsavePostAction(_id));
    else dispatch(savePostAction(_id));
  };

  if (loading) {
    return (
      <div className="main-section flex justify-center items-center h-screen-20">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="main-section flex flex-col md:flex-row bg-card border rounded-xl shadow-sm overflow-hidden mb-8">
      {/* Side Voting Section */}
      <div className="hidden md:flex flex-col items-center p-3 bg-muted/20 border-r w-14 pt-6">
        <VoteButtons post={post} vertical={true} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6">
        {/* Navigation & Context */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate(location.state?.from || "/")}
            className="p-2 rounded-full hover:bg-muted transition-colors border text-muted-foreground"
          >
            <IoIosArrowBack size={20} />
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link to={`/community/${community?.name}`} className="font-bold text-sm hover:underline">
                r/{community?.name}
              </Link>
              <span className="text-muted-foreground text-xs">•</span>
              <p className="text-xs text-muted-foreground">{createdAt}</p>
            </div>
          </div>
        </div>

        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              className="rounded-full overflow-hidden w-10 h-10 object-cover border"
              src={user?.avatar}
              alt={user?.name}
              loading="lazy"
            />
            <div className="flex flex-col">
              <Link 
                to={userData?._id === user?._id ? "/profile" : `/user/${user?._id}`}
                className="font-bold hover:underline decoration-primary"
              >
                u/{user?.name}
              </Link>
              <div className="flex items-center gap-2">
                {isPinned && (
                  <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase">
                    <Pin size={10} className="fill-green-600" /> Pinned
                  </span>
                )}
                {isNSFW && (
                  <span className="text-[10px] text-destructive font-bold uppercase border border-destructive/30 px-1 rounded">
                    NSFW
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Tooltip text={isSaved ? "Unsave" : "Save"}>
               <button 
                onClick={handleSave}
                className={cn(
                  "p-2 rounded-full hover:bg-muted transition-colors",
                  isSaved ? "text-primary" : "text-muted-foreground"
                )}
              >
                {isSaved ? <HiBookmark size={22} /> : <HiOutlineBookmark size={22} />}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Post Title & Content */}
        <div className="mb-6">
          {title && <h1 className="text-2xl font-bold mb-4 leading-tight">{title}</h1>}
          
          {isFlair && (
            <div className="inline-block bg-primary/10 text-primary text-xs uppercase font-bold px-3 py-1 rounded-full border border-primary/20 mb-4">
              {isFlair}
            </div>
          )}

          <div className="prose dark:prose-invert prose-lg max-w-none mb-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>

          {/* Media */}
          {fileUrl && (
            <div className="rounded-xl overflow-hidden border bg-muted/10 mb-6">
              {fileType === "image" ? (
                <PhotoProvider>
                  <PhotoView src={fileUrl}>
                    <img
                      src={fileUrl}
                      alt={title || content}
                      className="w-full max-h-[70vh] object-contain bg-black/5 cursor-zoom-in"
                    />
                  </PhotoView>
                </PhotoProvider>
              ) : (
                <video
                  className="w-full max-h-[70vh] bg-black/5 focus:outline-none"
                  src={fileUrl}
                  controls
                />
              )}
            </div>
          )}
        </div>

        {/* Post Footer / Actions */}
        <div className="flex items-center justify-between py-4 border-y border-muted/50 mb-8">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="md:hidden">
              <VoteButtons post={post} />
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground font-bold text-sm px-2 py-1.5 rounded hover:bg-muted transition-colors">
              <HiOutlineChatBubbleOvalLeft size={20} />
              <span>{comments.length} Comments</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground text-sm px-2 py-1.5">
              <HiOutlineEye size={20} />
              <span>{views} Views</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip text="Report post">
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className={cn(
                  "p-2 rounded hover:bg-muted transition-colors",
                  isReportedPost ? "text-orange-500" : "text-muted-foreground hover:text-orange-500"
                )}
              >
                <Flag size={20} className={isReportedPost ? "fill-orange-500" : ""} />
              </button>
            </Tooltip>

            {userData?._id === user?._id && (
              <Tooltip text="Delete post">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 rounded hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </Tooltip>
            )}
            
            <button className="p-2 rounded hover:bg-muted text-muted-foreground transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Discussion Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            Discussions
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {comments.length}
            </span>
          </h2>
          
          <div className="mb-10">
            <CommentForm communityId={community?._id} postId={_id} />
          </div>

          <div className="space-y-4">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <ThreadedComment 
                  key={comment._id} 
                  comment={comment} 
                  communityId={community?._id} 
                  postId={_id} 
                />
              ))
            ) : (
              <div className="text-center py-16 bg-muted/10 rounded-2xl border-2 border-dashed border-muted/30">
                <p className="text-muted-foreground font-medium italic">No comments yet. Start the conversation!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDeleteModal && (
        <DeleteModal
          showModal={showDeleteModal}
          postId={_id}
          onClose={() => setShowDeleteModal(false)}
          prevPath={location.state?.from || "/"}
        />
      )}

      {isReportModalOpen && (
        <ReportPostModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          postId={_id}
          communityId={community?._id}
          setReportedPost={setIsReportedPost}
        />
      )}
    </div>
  );
};

export default PostView;
