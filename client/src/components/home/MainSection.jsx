import { memo, useMemo, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPostsAction,
  clearPostsAction,
} from "../../redux/actions/postActions";
import Post from "../post/Post";
import SkeletonPost from "../post/SkeletonPost";
import SortTabs from "../post/SortTabs";
import PostForm from "../form/PostForm";
import Home from "../../assets/home.jpg";
import { cn } from "@/lib/utils";

const MemoizedPost = memo(Post);

const LoadMoreButton = ({ onClick, isLoading }) => (
  <button
    className="bg-primary hover:bg-blue-700 text-sm text-white font-semibold rounded-xl w-full p-3 my-4 transition-colors shadow-sm disabled:opacity-50"
    onClick={onClick}
    disabled={isLoading}
  >
    {isLoading ? "Loading more..." : "Load More Posts"}
  </button>
);

const MainSection = ({ userData }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const posts = useSelector((state) => state.posts?.posts || []);
  const totalPosts = useSelector((state) => state.posts?.totalPosts || 0);
  const currentSort = useSelector((state) => state.posts?.currentSort || "new");
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities
  );

  const LIMIT = 10;

  const fetchPosts = useCallback((skipCount = 0, sortType = currentSort) => {
    if (skipCount === 0) setIsLoading(true);
    else setIsLoadMoreLoading(true);

    return dispatch(getPostsAction(LIMIT, skipCount, sortType)).finally(() => {
      setIsLoading(false);
      setIsLoadMoreLoading(false);
    });
  }, [dispatch, currentSort]);

  useEffect(() => {
    if (userData) {
      fetchPosts(0, currentSort);
    }
    return () => {
      dispatch(clearPostsAction());
    };
  }, [userData, dispatch, currentSort]); // Refetch when sort changes

  const handleSortChange = (newSort) => {
    if (newSort !== currentSort) {
      dispatch(clearPostsAction());
      fetchPosts(0, newSort);
    }
  };

  const handleLoadMore = () => {
    fetchPosts(posts.length, currentSort);
  };

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => <MemoizedPost key={post._id} post={post} />);
  }, [posts]);

  return (
    <div className="flex flex-col gap-4">
      {/* Post Creation Mini-Form */}
      <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={userData?.avatar}
            alt={userData?.name}
            className="w-10 h-10 rounded-full object-cover border bg-muted"
          />
          <div 
            onClick={() => setSelectedCommunity(joinedCommunities?.[0] || null)}
            className="flex-1 bg-muted/50 hover:bg-muted rounded-lg py-2.5 px-5 cursor-pointer transition-colors border text-muted-foreground text-sm font-medium"
          >
            Create a post...
          </div>
        </div>

        {joinedCommunities?.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {joinedCommunities.map((community) => (
                <button
                  key={community._id}
                  onClick={() =>
                    setSelectedCommunity(
                      selectedCommunity?._id === community._id ? null : community
                    )
                  }
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
                    selectedCommunity?._id === community._id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                  )}
                >
                  r/{community.name}
                </button>
              ))}
            </div>

            {selectedCommunity && (
              <div className="mt-2 border-t pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <PostForm
                  communityId={selectedCommunity._id}
                  communityName={selectedCommunity.name}
                  onSuccess={() => setSelectedCommunity(null)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sorting Tabs */}
      <SortTabs value={currentSort} onChange={handleSortChange} />

      {/* Posts Feed */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <SkeletonPost count={5} />
        ) : (
          <>
            {memoizedPosts}
            
            {posts.length > 0 && posts.length < totalPosts && (
              <LoadMoreButton
                onClick={handleLoadMore}
                isLoading={isLoadMoreLoading}
              />
            )}

            {posts.length === 0 && !isLoading && (
              <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted/30">
                  <img loading="lazy" src={Home} alt="empty" className="w-24 h-24 opacity-20 grayscale" />
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground">No posts yet</p>
                  <p className="text-muted-foreground text-sm">Join more communities or be the first to post!</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainSection;
