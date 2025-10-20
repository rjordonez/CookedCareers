import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ItemCardProps {
  title: string;
  company: string;
  type: "resume" | "project";
  tags: string[];
  imageUrl: string;
}

const ItemCard = ({ title, company, type, tags, imageUrl }: ItemCardProps) => {
  return (
    <Card className="group overflow-hidden border border-border hover:shadow-lg transition-all duration-300 cursor-pointer bg-card">
      <div className="aspect-[3/4] bg-muted overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm leading-tight">{title}</h3>
          <Badge 
            variant="secondary" 
            className="text-xs shrink-0"
          >
            {type}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{company}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md bg-secondary text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
