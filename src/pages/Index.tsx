import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import BrowseGrid from "@/components/BrowseGrid";
import CompanyLogos from "@/components/CompanyLogos";
import UniversityLogos from "@/components/UniversityLogos";
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
        <BrowseGrid />
        <UniversityLogos />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
