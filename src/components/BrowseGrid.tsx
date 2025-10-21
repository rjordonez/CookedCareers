import ItemCard from "./ItemCard";
import FilterTabs from "./FilterTabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import resumeBlur1 from "@/assets/resume-blur-1.jpg";
import resumeBlur2 from "@/assets/resume-blur-2.jpg";
import resumeBlur3 from "@/assets/resume-blur-3.jpg";
import resumeBlur4 from "@/assets/resume-blur-4.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Sample data - in a real app, this would come from an API
const items = [
  {
    id: 1,
    title: "Software Engineer Resume",
    company: "Google",
    type: "resume" as const,
    tags: ["Python", "React", "AWS"],
    imageUrl: resumeBlur1,
  },
  {
    id: 2,
    title: "Full Stack Portfolio",
    company: "Meta",
    type: "project" as const,
    tags: ["Node.js", "MongoDB", "Docker"],
    imageUrl: resumeBlur2,
  },
  {
    id: 3,
    title: "ML Engineer Application",
    company: "OpenAI",
    type: "resume" as const,
    tags: ["Python", "TensorFlow", "PyTorch"],
    imageUrl: resumeBlur3,
  },
  {
    id: 4,
    title: "E-commerce Platform",
    company: "Shopify",
    type: "project" as const,
    tags: ["React", "TypeScript", "Stripe"],
    imageUrl: resumeBlur4,
  },
  {
    id: 5,
    title: "Backend Developer Resume",
    company: "Netflix",
    type: "resume" as const,
    tags: ["Java", "Spring", "Kafka"],
    imageUrl: resumeBlur1,
  },
  {
    id: 6,
    title: "Mobile App Development",
    company: "Apple",
    type: "project" as const,
    tags: ["Swift", "iOS", "Firebase"],
    imageUrl: resumeBlur2,
  },
  {
    id: 7,
    title: "Data Science Resume",
    company: "Amazon",
    type: "resume" as const,
    tags: ["Python", "SQL", "Tableau"],
    imageUrl: resumeBlur3,
  },
  {
    id: 8,
    title: "Web3 DApp Project",
    company: "Coinbase",
    type: "project" as const,
    tags: ["Solidity", "Web3.js", "Ethereum"],
    imageUrl: resumeBlur4,
  },
  {
    id: 9,
    title: "DevOps Engineer Resume",
    company: "Microsoft",
    type: "resume" as const,
    tags: ["Kubernetes", "CI/CD", "Azure"],
    imageUrl: resumeBlur1,
  },
];

const BrowseGrid = () => {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 px-6 bg-background fade-in">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center mb-12">
          Study Applications That Lands Offers
        </h2>

        {/* Filter Tabs */}
        <div className="mb-12">
          <FilterTabs />
        </div>

        {/* Horizontal scrolling container */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
            <div className="flex gap-6 pb-4" style={{ minWidth: 'max-content' }}>
              {items.map((item) => (
                <div key={item.id} className="w-80 shrink-0">
                  <ItemCard {...item} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/auth">
            <Button size="lg" className="rounded-full font-medium px-10 h-14 shadow-lg hover:shadow-xl transition-shadow">
              Get access to all samples
            </Button>
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default BrowseGrid;
