import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-6">
          Learn from 1,000+ successful examples.
        </h2>
        
        <p className="text-muted-foreground mb-10">
          Stop guessing what works, see what actually got people hired.
        </p>
        
        <Link to="/auth">
          <Button size="lg" className="rounded-full font-medium px-10 h-14 shadow-lg hover:shadow-xl transition-shadow">
            Join Now →
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
