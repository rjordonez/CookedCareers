import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const Hero = () => {
  return <section className="pt-16 pb-12 px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto text-center">
        
        
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Get hired by learning from those who made it
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">Access 1,000+ successful CS resumes, projects, and portfolios<br />
that landed jobs at top tech companies</p>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/auth">
            <Button size="lg" className="rounded-full text-base font-medium px-8 h-12">
              Join for free
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default Hero;