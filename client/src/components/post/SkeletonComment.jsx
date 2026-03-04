/**
 * SkeletonComment — Shimmer placeholder for loading comments.
 */
const SkeletonComment = ({ count = 3, depth = 0 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={depth > 0 ? "ml-6 border-l pl-4" : ""}>
          <div className="flex gap-2 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted/60" />
              </div>
              <div className="h-3 w-full rounded bg-muted/70" />
              <div className="h-3 w-2/3 rounded bg-muted/50" />
              <div className="flex gap-4 pt-1">
                <div className="h-4 w-12 rounded bg-muted/40" />
                <div className="h-4 w-12 rounded bg-muted/40" />
              </div>
            </div>
          </div>
          {depth < 2 && i === 0 && (
            <div className="mt-4">
              <SkeletonComment count={1} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonComment;
