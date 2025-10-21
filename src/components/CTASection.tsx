import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { usePostHog } from "posthog-js/react";

const CTASection = () => {
  const ref = useScrollAnimation();
  const posthog = usePostHog();

  return (
    <section ref={ref} className="py-24 px-6 bg-background fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a1a1a] rounded-3xl p-12 text-center">
          <h2 className="mb-3 text-white">
            Your Next Interview Starts Here
          </h2>

          <p className="text-gray-400 mb-10">
            Learn from 1,000+ applications that turned into job offers
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/auth">
              <Button
                size="lg"
                className="rounded-full font-medium px-10 h-14 shadow-lg hover:shadow-xl transition-shadow bg-white text-black hover:bg-gray-100"
                onClick={() => posthog?.capture('cta_join_now_clicked')}
              >
                Join Now →
              </Button>
            </Link>
            <a href="https://calendly.com/jessie-nativespeaking/consultation-call" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full font-medium px-10 h-14 border-gray-600 text-white hover:bg-white/10"
                onClick={() => posthog?.capture('book_consultation_clicked', { location: 'cta_section' })}
              >
                Book a consultation call
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
