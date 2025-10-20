import ItemCard from "./ItemCard";
import resumeBlur1 from "@/assets/resume-blur-1.jpg";
import resumeBlur2 from "@/assets/resume-blur-2.jpg";
import resumeBlur3 from "@/assets/resume-blur-3.jpg";
import resumeBlur4 from "@/assets/resume-blur-4.jpg";

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
  return (
    <section className="py-16 px-6" id="browse">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4">
          Find job application<br />examples in seconds.
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Browse through our curated collection of successful applications
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} {...item} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Showing 9 of 1,000+ items
          </p>
          <button className="text-foreground font-medium hover:underline">
            Load more →
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrowseGrid;
