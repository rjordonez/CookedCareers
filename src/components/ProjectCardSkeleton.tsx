import { Card } from "@/components/ui/card";

const ProjectCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border border-border h-full animate-pulse bg-card">
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 border-b" />
      <div className="p-4">
        <div className="h-3 bg-gray-300 rounded w-2/3" />
      </div>
    </Card>
  );
};

export default ProjectCardSkeleton;
