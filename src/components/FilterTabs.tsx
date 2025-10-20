import { cn } from "@/lib/utils";

const tabs = ["Resumes", "Projects", "Portfolios"];

const FilterTabs = () => {
  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {tabs.map((tab) => (
        <span
          key={tab}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium bg-secondary text-muted-foreground"
          )}
        >
          {tab}
        </span>
      ))}
    </div>
  );
};

export default FilterTabs;
