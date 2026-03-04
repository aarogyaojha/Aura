/**
 * SkeletonPost — Shimmer placeholder for loading post cards.
 * Renders n skeleton cards when posts are loading.
 *
 * Props:
 *   count – number of skeleton cards to show (default: 4)
 */
const SkeletonPost = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card border rounded-xl p-4 space-y-3 animate-pulse"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-32 rounded bg-muted" />
              <div className="h-2.5 w-20 rounded bg-muted/70" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2 pl-11">
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted/70" />
            <div className="h-3 w-5/6 rounded bg-muted/60" />
            <div className="h-3 w-2/3 rounded bg-muted/50" />
          </div>

          {/* Image placeholder (50% chance) */}
          {i % 2 === 0 && (
            <div className="ml-11 h-40 rounded-lg bg-muted/60" />
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 pl-11 mt-2">
            <div className="h-6 w-16 rounded-full bg-muted" />
            <div className="h-6 w-16 rounded-full bg-muted/80" />
            <div className="h-6 w-12 rounded-full bg-muted/60" />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonPost;
