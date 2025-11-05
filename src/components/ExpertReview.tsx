import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { usePostHog } from "posthog-js/react";

const ExpertReview = () => {
  const ref = useScrollAnimation();
  const posthog = usePostHog();

  const benefits = [
    "Get instant feedback tailored to your needs",
    "Choose your reviewer: CookedCareer Team, Recruiters, or Engineers",
    "Resolve specific resume concerns for peace of mind",
    "Get human insights AI tools can't provide"
  ];

  return (
    <section ref={ref} className="py-20 px-6 bg-background fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Expert Review Before You Apply
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stop second-guessing your resume with conflicting online advice.
            <br />
            Get one clear answer from recruiters
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-card p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/20 h-full flex items-center group-hover:scale-[1.02] active:scale-[0.98]">
                  <p className="text-base font-medium leading-relaxed text-foreground">
                    ✓ {benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/auth">
            <Button
              size="lg"
              className="rounded-full bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] font-bold text-lg px-10 h-14 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => posthog?.capture('expert_review_cta_clicked')}
            >
              Get expert feedback
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExpertReview;
