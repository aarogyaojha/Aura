import { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserAction } from "../../redux/actions/userActions";
import PostOnProfile from "../post/PostOnProfile";
import SkeletonPost from "../post/SkeletonPost";
import OwnProfileCard from "./OwnProfileCard";
import OwnInfoCard from "./OwnInfoCard";
import NoPost from "../../assets/nopost.jpg";

const UserProfile = ({ userData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user?.user);
  const posts = user?.posts || [];

  useEffect(() => {
    if (!userData?._id) return;
    
    setLoading(true);
    dispatch(getUserAction(userData._id)).finally(() => {
      setLoading(false);
    });
  }, [dispatch, userData?._id]);

  const MemoizedPostOnProfile = memo(PostOnProfile);

  return (
    <div className="flex flex-col gap-6">
      {!user && loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-40 bg-muted rounded-xl" />
          <div className="h-8 w-48 bg-muted rounded mx-auto" />
          <SkeletonPost count={3} />
        </div>
      ) : (
        <>
          <OwnProfileCard user={user} />
          <OwnInfoCard user={user} />

          <div className="pt-4 border-t">
            <h3 className="font-bold text-xl mb-6 text-foreground text-center">
              Recent Posts
            </h3>

            <div className="flex flex-col gap-4">
              {loading ? (
                <SkeletonPost count={3} />
              ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border-2 border-dashed border-border flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-muted/50">
                    <img
                      className="w-24 h-24 grayscale opacity-30"
                      src={NoPost}
                      alt="no post"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">No posts yet</p>
                    <p className="text-muted-foreground text-sm">Post something to see it here!</p>
                  </div>
                </div>
              ) : (
                posts.map((post) => (
                  <MemoizedPostOnProfile key={post._id} post={post} />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
