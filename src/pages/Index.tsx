import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProblemTransformation from "@/components/ProblemTransformation";
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
        <CompanyLogos />
        <ProblemTransformation />
        <BrowseGrid />
        <UniversityLogos />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
