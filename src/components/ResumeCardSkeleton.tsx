import { Card } from "@/components/ui/card";

const ResumeCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-0 bg-muted rounded-2xl h-full animate-pulse">
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-300 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-300 rounded" />
          <div className="h-6 w-16 bg-gray-300 rounded" />
        </div>
      </div>
    </Card>
  );
};

export default ResumeCardSkeleton;
