import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="grid place-items-center px-6 pt-24 pb-16 animate-fade-in">
      <h1 className="max-w-[400px] text-center text-5xl font-bold tracking-tight leading-tight md:max-w-[600px] md:text-6xl lg:max-w-[900px] lg:text-7xl">
        Learn From Applications<br />That Landed Offers
      </h1>

      <p className="max-w-[450px] pt-6 text-center text-lg text-muted-foreground md:max-w-[550px] md:text-xl lg:max-w-[700px]">
        Access 1,000+ successful CS resumes, projects, and portfolios that landed jobs at top tech companies
      </p>

      <div className="pt-10">
        <Link to="/auth">
          <Button size="lg" className="rounded-full text-base font-semibold px-4 h-11 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
            Join for free
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;