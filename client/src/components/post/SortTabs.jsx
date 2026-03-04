/**
 * SortTabs — Reddit-style post sort selector
 * Props:
 *   value     – current sort ('new' | 'hot' | 'top' | 'rising')
 *   onChange  – callback(newSort: string)
 */
import { Flame, Clock, TrendingUp, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SORTS = [
  {
    key: "hot",
    label: "Hot",
    icon: Flame,
    desc: "Posts gaining traction right now",
    iconClass: "text-orange-500",
  },
  {
    key: "new",
    label: "New",
    icon: Clock,
    desc: "Most recently posted",
    iconClass: "text-green-500",
  },
  {
    key: "top",
    label: "Top",
    icon: ChevronUp,
    desc: "Highest upvoted posts",
    iconClass: "text-blue-500",
  },
  {
    key: "rising",
    label: "Rising",
    icon: TrendingUp,
    desc: "Growing quickly",
    iconClass: "text-purple-500",
  },
];

const SortTabs = ({ value = "hot", onChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border mb-3">
      {SORTS.map(({ key, label, icon: Icon, desc, iconClass }) => {
        const active = value === key;
        return (
          <button
            key={key}
            aria-label={desc}
            title={desc}
            onClick={() => onChange?.(key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
              active
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Icon
              className={cn("h-3.5 w-3.5", active ? iconClass : "opacity-60")}
            />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SortTabs;
