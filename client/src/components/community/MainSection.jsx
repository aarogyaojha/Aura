import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getComPostsAction,
  clearCommunityPostsAction,
} from "../../redux/actions/postActions";
import PostForm from "../form/PostForm";
import Post from "../post/Post";
import SkeletonPost from "../post/SkeletonPost";
import SortTabs from "../post/SortTabs";
import FollowingUsersPosts from "./FollowingUsersPosts";
import { cn } from "@/lib/utils";

const MemoizedPost = memo(Post);

const MainSection = () => {
  const dispatch = useDispatch();

  const communityData = useSelector((state) => state.community?.communityData);
  const communityPosts = useSelector((state) => state.posts?.communityPosts || []);
  const totalCommunityPosts = useSelector((state) => state.posts?.totalCommunityPosts || 0);
  const communitySort = useSelector((state) => state.posts?.communitySort || "new");
  const postError = useSelector((state) => state.posts?.postError);

  const [activeTab, setActiveTab] = useState("All posts");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const LIMIT = 10;

  const fetchCommunityPosts = useCallback((skipCount = 0, sortType = communitySort) => {
    if (!communityData?._id) return;
    
    if (skipCount === 0) setIsLoading(true);
    else setIsLoadMoreLoading(true);

    return dispatch(getComPostsAction(communityData._id, LIMIT, skipCount, sortType)).finally(() => {
      setIsLoading(false);
      setIsLoadMoreLoading(false);
    });
  }, [dispatch, communityData?._id, communitySort]);

  useEffect(() => {
    if (communityData?._id) {
      fetchCommunityPosts(0, communitySort);
    }
    return () => {
      dispatch(clearCommunityPostsAction());
    };
  }, [communityData?._id, communitySort]);

  const handleSortChange = (newSort) => {
    if (newSort !== communitySort) {
      dispatch(clearCommunityPostsAction());
      fetchCommunityPosts(0, newSort);
    }
  };

  const handleLoadMore = () => {
    fetchCommunityPosts(communityPosts.length, communitySort);
  };

  const memoizedCommunityPosts = useMemo(() => {
    return communityPosts?.map((post) => (
      <MemoizedPost key={post._id} post={post} />
    ));
  }, [communityPosts]);

  const tabs = ["All posts", "You're following"];

  return (
    <div className="flex flex-col gap-4">
      {/* Tab Navigation */}
      <div className="flex p-1 bg-muted/50 rounded-xl border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 px-4 text-sm font-bold rounded-lg transition-all duration-200",
              activeTab === tab 
                ? "bg-background shadow-sm text-primary" 
                : "text-muted-foreground hover:bg-background/30"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {activeTab === "All posts" && (
          <>
            <div className="mb-2">
              <PostForm
                communityId={communityData?._id}
                communityName={communityData?.name}
              />
            </div>

            {postError && (
              <div className="text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-xl text-center text-sm font-medium">
                {postError}
              </div>
            )}

            <SortTabs value={communitySort} onChange={handleSortChange} />

            <div className="flex flex-col gap-4">
              {isLoading ? (
                <SkeletonPost count={5} />
              ) : (
                <>
                  {memoizedCommunityPosts}
                  
                  {communityPosts.length < totalCommunityPosts && (
                    <button
                      className="bg-primary hover:bg-blue-700 text-sm text-white font-semibold rounded-xl w-full p-3 my-2 transition-colors disabled:opacity-50"
                      onClick={handleLoadMore}
                      disabled={isLoadMoreLoading}
                    >
                      {isLoadMoreLoading ? "Loading more..." : "Load More Posts"}
                    </button>
                  )}

                  {communityPosts.length === 0 && !isLoading && (
                    <div className="text-center py-20 bg-muted/10 rounded-xl border-2 border-dashed border-muted/30">
                      <p className="text-muted-foreground font-medium italic">No posts in this community yet.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {activeTab === "You're following" && (
          <FollowingUsersPosts communityData={communityData} />
        )}
      </div>
    </div>
  );
};

export default MainSection;
