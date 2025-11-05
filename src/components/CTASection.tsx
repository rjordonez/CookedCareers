import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { usePostHog } from "posthog-js/react";

const CTASection = () => {
  const ref = useScrollAnimation();
  const posthog = usePostHog();

  return (
    <section ref={ref} className="py-32 px-6 bg-background fade-in">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          88% get filtered by ATS.
          <br />
          Don't be one of them.
        </h2>

        <Link to="/auth">
          <Button
            size="lg"
            className="rounded-full font-semibold text-base px-8 h-12 shadow-md hover:shadow-lg transition-all bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] mt-2"
            onClick={() => posthog?.capture('cta_scan_resume_clicked')}
          >
            Get ATS-Ready Now →
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
