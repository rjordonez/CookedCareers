import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CTASection = () => {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 px-6 bg-background fade-in">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-3">
          Your Next Interview Starts Here
        </h2>

        <p className="text-muted-foreground mb-10">
          Learn from 1,000+ applications that turned into job offers
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
