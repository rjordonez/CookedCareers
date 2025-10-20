import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ProBadge = () => {
  return (
    <Badge
      variant="default"
      className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0"
    >
      <Crown className="mr-1 h-3 w-3" />
      Pro
    </Badge>
  );
};
