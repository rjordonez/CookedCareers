import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-6">
          Never run out of<br />
          inspiration again.
        </h2>
        <p className="text-xl text-muted-foreground mb-10">
          Use CSLibrary for free as long as you like or get full access<br />
          with any of our paid plans.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button size="lg" className="rounded-full text-base font-medium px-8 h-12">
            Join for free
          </Button>
          <Button 
            size="lg" 
            variant="ghost" 
            className="rounded-full text-base font-medium px-8 h-12 group"
          >
            See our plans
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
