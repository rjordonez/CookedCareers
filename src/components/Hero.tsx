import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-accent flex items-center justify-center shadow-lg">
            <span className="text-5xl font-bold text-foreground">C</span>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Discover real-world<br />
          CS job applications.
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
          Featuring over 1,000+ resumes and programming projects from successful CS students — New content weekly.
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

export default Hero;
