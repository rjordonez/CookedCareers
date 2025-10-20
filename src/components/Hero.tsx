import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
const Hero = () => {
  return <section className="pt-32 pb-20 px-6 animate-fade-in">
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
        
        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">Access 1,000+ successful CS resumes, projects, and portfolios
that landed jobs at top tech companies</p>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button size="lg" className="rounded-full text-base font-medium px-8 h-12">
            Join for free
          </Button>
          <Button size="lg" variant="outline" className="rounded-full text-base font-medium px-8 h-12">
            Book a consultation call
          </Button>
        </div>
      </div>
    </section>;
};
export default Hero;