import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = ["All", "Resumes", "Projects", "Portfolios"];

const FilterTabs = () => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
            activeTab === tab
              ? "bg-foreground text-background"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
