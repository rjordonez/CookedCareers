import ItemCard from "./ItemCard";

// Sample data - in a real app, this would come from an API
const items = [
  {
    id: 1,
    title: "Software Engineer Resume",
    company: "Google",
    type: "resume" as const,
    tags: ["Python", "React", "AWS"],
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Full Stack Portfolio",
    company: "Meta",
    type: "project" as const,
    tags: ["Node.js", "MongoDB", "Docker"],
    imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=600&fit=crop",
  },
  {
    id: 3,
    title: "ML Engineer Application",
    company: "OpenAI",
    type: "resume" as const,
    tags: ["Python", "TensorFlow", "PyTorch"],
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=600&fit=crop",
  },
  {
    id: 4,
    title: "E-commerce Platform",
    company: "Shopify",
    type: "project" as const,
    tags: ["React", "TypeScript", "Stripe"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop",
  },
  {
    id: 5,
    title: "Backend Developer Resume",
    company: "Netflix",
    type: "resume" as const,
    tags: ["Java", "Spring", "Kafka"],
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=600&fit=crop",
  },
  {
    id: 6,
    title: "Mobile App Development",
    company: "Apple",
    type: "project" as const,
    tags: ["Swift", "iOS", "Firebase"],
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=600&fit=crop",
  },
  {
    id: 7,
    title: "Data Science Resume",
    company: "Amazon",
    type: "resume" as const,
    tags: ["Python", "SQL", "Tableau"],
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=600&fit=crop",
  },
  {
    id: 8,
    title: "Web3 DApp Project",
    company: "Coinbase",
    type: "project" as const,
    tags: ["Solidity", "Web3.js", "Ethereum"],
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=600&fit=crop",
  },
  {
    id: 9,
    title: "DevOps Engineer Resume",
    company: "Microsoft",
    type: "resume" as const,
    tags: ["Kubernetes", "CI/CD", "Azure"],
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=600&fit=crop",
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
