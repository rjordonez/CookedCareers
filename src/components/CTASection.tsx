import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-3">
          1,000+ proven resumes that get offers
        </h2>

        <p className="text-muted-foreground mb-10">
          Stop guessing, see what actually lands interviews at top tech companies
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/auth">
            <Button size="lg" className="rounded-full font-medium px-10 h-14 shadow-lg hover:shadow-xl transition-shadow">
              Join Now →
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="rounded-full font-medium px-10 h-14">
            Book a consultation call
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
