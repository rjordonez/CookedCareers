import twoSigmaScreenshot from "@/assets/testimonials/two-sigma-interview.png";
import lyftScreenshot from "@/assets/testimonials/lyft-interview.png";
import dexcomScreenshot from "@/assets/testimonials/dexcom-interview.png";
import rippleScreenshot from "@/assets/testimonials/ripple-interview.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Ananya S.",
    school: "University of Illinois Urbana-Champaign (Master's, International)",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
    quote: "I was getting ghosted after dozens of applications. Seeing real resumes that worked gave me hope. Just got my first interview invite!",
  },
  {
    name: "Jason L.",
    school: "University of Texas at Austin",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    quote: "Had no idea why I wasn't getting replies. This showed me what actually works, and recruiters finally started noticing me.",
  },
  {
    name: "Priya K.",
    school: "University of Washington",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80",
    quote: "Every application felt like a black hole. These examples gave me a clear path and I landed an interview immediately.",
  },
  {
    name: "Wei C.",
    school: "Georgia Tech (Master's, International)",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80",
    quote: "Months of silence made me feel stuck. Following guidance from successful candidates, I finally started getting responses.",
  },
  {
    name: "Sofia T.",
    school: "Purdue University",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
    quote: "Desperately needed real examples. Seeing what worked helped me rewrite my resume and feel confident again.",
  },
];

const successScreenshots = [
  {
    company: "Dexcom",
    alt: "Dexcom interview invitation",
    image: dexcomScreenshot,
  },
  {
    company: "Lyft",
    alt: "Lyft final interview invitation",
    image: lyftScreenshot,
  },
  {
    company: "Two Sigma",
    alt: "Two Sigma interview confirmation",
    image: twoSigmaScreenshot,
  },
  {
    company: "Ripple",
    alt: "Ripple technical assessment invitation",
    image: rippleScreenshot,
  },
];

const UniversityLogos = () => {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 px-6 bg-background fade-in relative">
      {/* Gradient fade at bottom */}
      <div className="pointer-events-none absolute bottom-0 h-[20%] md:h-[35%] w-full bg-gradient-to-t from-background to-transparent"></div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-center mb-16 text-3xl md:text-4xl lg:text-5xl font-bold">
          What our users are saying.
        </h2>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="mb-4 md:mb-6 break-inside-avoid"
            >
              <div className="bg-background rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.school}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{testimonial.quote}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interview Screenshots Carousel */}
        <div className="mt-16 relative overflow-hidden">
          <div className="flex gap-6 pb-4 animate-scroll-screenshots">
            {/* First set */}
            {successScreenshots.map((screenshot, index) => (
              <div key={`${screenshot.company}-1-${index}`} className="flex-none w-[80%] sm:w-[500px] md:w-[600px]">
                <div className="bg-background rounded-2xl p-4 border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src={screenshot.image}
                    alt={screenshot.alt}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {successScreenshots.map((screenshot, index) => (
              <div key={`${screenshot.company}-2-${index}`} className="flex-none w-[80%] sm:w-[500px] md:w-[600px]">
                <div className="bg-background rounded-2xl p-4 border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src={screenshot.image}
                    alt={screenshot.alt}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-screenshots {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-screenshots {
          animation: scroll-screenshots 35s linear infinite;
        }

        .animate-scroll-screenshots:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default UniversityLogos;
