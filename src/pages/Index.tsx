import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";
import FilterTabs from "@/components/FilterTabs";
import BrowseGrid from "@/components/BrowseGrid";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <LogoStrip />
        <div className="max-w-7xl mx-auto px-6">
          <FilterTabs />
        </div>
        <BrowseGrid />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
