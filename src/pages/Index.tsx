import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";
import ProblemTransformation from "@/components/ProblemTransformation";
import FilterTabs from "@/components/FilterTabs";
import BrowseGrid from "@/components/BrowseGrid";
import CompanyLogos from "@/components/CompanyLogos";
import UniversityLogos from "@/components/UniversityLogos";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const Index = () => {
  useSmoothScroll();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <LogoStrip />
        <ProblemTransformation />
        <div className="max-w-7xl mx-auto px-6">
          <FilterTabs />
        </div>
        <BrowseGrid />
        <CompanyLogos />
        <UniversityLogos />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
