import { ShieldCheck, Award, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const OwnInfoCard = ({ user }) => {
  const totalKarma = (user.postKarma || 0) + (user.commentKarma || 0);

  return (
    <div className="bg-card rounded-xl border p-6 space-y-4 my-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
        <h3 className="text-lg font-bold">Profile Summary</h3>
        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          Joined {user.duration || "recently"}
        </div>
      </div>

      {/* Karma Stats Grid */}
      <div className="grid grid-cols-3 gap-4 py-2">
        <div className="flex flex-col items-center p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
          <Award className="h-4 w-4 text-orange-500 mb-1" />
          <span className="text-lg font-bold leading-tight">{totalKarma}</span>
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Karma</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
          <ShieldCheck className="h-4 w-4 text-blue-500 mb-1" />
          <span className="text-lg font-bold leading-tight">{user.postKarma || 0}</span>
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Post Karma</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-green-500/5 border border-green-500/10">
          <MessageSquare className="h-4 w-4 text-green-500 mb-1" />
          <span className="text-lg font-bold leading-tight">{user.commentKarma || 0}</span>
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Comment Karma</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Posts</span>
          <span className="font-bold">{user.totalPosts || 0}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Communities Joined</span>
          <span className="font-bold">{user.totalCommunities || 0}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Followers</span>
          <span className="font-bold">{user.followers?.length || 0}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Following</span>
          <span className="font-bold">{user.following?.length || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default OwnInfoCard;
