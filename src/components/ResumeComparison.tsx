import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { usePostHog } from "posthog-js/react";
import resume1 from "@/assets/resumes/Screenshot 2025-11-05 at 3.49.12 PM.png";
import resume2 from "@/assets/resumes/Channing Pear_Google.png";

const ResumeComparison = () => {
  const [sliderValue, setSliderValue] = useState([50]);
  const [score, setScore] = useState(50);
  const posthog = usePostHog();

  useEffect(() => {
    // Auto-animate slider with smooth transitions: 50 -> 70 -> 60 -> 100 -> back to 50
    const sequence = [
      { value: 50, duration: 2000 },
      { value: 70, duration: 2000 },
      { value: 60, duration: 2000 },
      { value: 100, duration: 2500 },
      { value: 50, duration: 2500 },
    ];

    let currentStep = 0;
    let animationFrameId: number;
    let startTime: number | null = null;
    let startValue = 50;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const step = sequence[currentStep];
      const progress = Math.min(elapsed / step.duration, 1);

      // Ease-in-out animation
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentValue = startValue + (step.value - startValue) * easeProgress;

      setSliderValue([currentValue]);
      setScore(Math.round(currentValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Move to next step
        startValue = step.value; // Set start value to current end value
        currentStep = (currentStep + 1) % sequence.length;
        startTime = null;
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const goodResumeImage = resume2; // Left side
  const badResumeImage = resume1;  // Right side

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ATS Checker: Tailor Your Resume to Any Job
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare your resume to job postings instantly.
            <br />
            Get feedback on what to customize without spending hours tweaking.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Resume Preview with Slider */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-background shadow-2xl">
              {/* Bad Resume (right side, revealed as slider moves right) */}
              <div className="w-full h-auto">
                <img
                  src={badResumeImage}
                  alt="Bad Resume"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Good Resume (left side, covers bad resume based on slider position) */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `inset(0 ${100 - sliderValue[0]}% 0 0)`
                }}
              >
                <img
                  src={goodResumeImage}
                  alt="Good Resume"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Slider Line with Score */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-primary z-10 pointer-events-none"
                style={{ left: `${sliderValue[0]}%` }}
              >
                {/* Score Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-background border-2 border-primary rounded-full px-4 py-2 shadow-lg">
                    <div className={`text-2xl font-bold transition-colors duration-300 ${score >= 90 ? 'text-green-500' : score >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {score}%
                    </div>
                    <div className="text-xs text-muted-foreground text-center">ATS</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <Link to="/auth">
              <Button
                size="lg"
                className="rounded-full bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] font-bold text-lg px-10 h-14 shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => posthog?.capture('comparison_cta_clicked')}
              >
                Optimize your resume
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeComparison;
