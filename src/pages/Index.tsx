import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import UniversityLogos from "@/components/UniversityLogos";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ResumeCarousel from "@/components/ResumeCarousel";
import ResumeComparison from "@/components/ResumeComparison";
import ExpertReview from "@/components/ExpertReview";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const Index = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <WhySection />
        <ResumeCarousel />
        <ResumeComparison />
        <ExpertReview />
        <UniversityLogos />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
