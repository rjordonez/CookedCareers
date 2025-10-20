import { useEffect, useRef } from "react";
import twoSigmaScreenshot from "@/assets/testimonials/two-sigma-interview.png";
import lyftScreenshot from "@/assets/testimonials/lyft-interview.png";
import dexcomScreenshot from "@/assets/testimonials/dexcom-interview.png";
import rippleScreenshot from "@/assets/testimonials/ripple-interview.png";

const testimonials = [
  {
    name: "Emily R.",
    school: "University of Illinois Urbana-Champaign (Master's, International)",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    quote: "I kept getting ghosted after sending dozens of resumes. I was desperate for a strategy. Seeing real resumes that actually got interviews gave me hope. I finally got one and now just waiting for the final call!",
  },
  {
    name: "Jason L.",
    school: "University of Texas at Austin",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    quote: "I had no idea why I wasn't getting replies. I needed feedback from someone who'd been there. This platform showed me what works, and suddenly recruiters started noticing me.",
  },
  {
    name: "Priya K.",
    school: "University of Washington",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80",
    quote: "Every application felt like throwing resumes into a black hole. Using examples from people who actually got interviews finally gave me a clear path and I landed an interview invite immediately.",
  },
  {
    name: "Daniel M.",
    school: "Georgia Tech (Master's, International)",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
    quote: "Months of silence made me feel stuck and hopeless. I needed a new approach. Following guidance from successful candidates, I finally started getting responses.",
  },
  {
    name: "Sofia T.",
    school: "Purdue University",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
    quote: "I was desperate for real feedback and examples. Seeing what actually worked helped me rewrite my resume and finally feel confident sending applications again.",
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
  const testimonialsScrollRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  const startScrolling = (direction: 'left' | 'right') => {
    const container = testimonialsScrollRef.current;
    if (!container) return;

    scrollIntervalRef.current = window.setInterval(() => {
      const scrollAmount = direction === 'left' ? -3 : 3;
      container.scrollBy({ left: scrollAmount });
    }, 10);
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            What our users are saying.
          </h2>
        </div>

        {/* Horizontal Scrolling Testimonials */}
        <div className="relative mb-16">
          <div
            ref={testimonialsScrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-none w-[90%] sm:w-[400px] bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300 snap-start"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-base">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.school}
                    </p>
                  </div>
                </div>

                <p className="text-gray-900 leading-relaxed text-base">
                  {testimonial.quote}
                </p>
              </div>
            ))}
          </div>

          {/* Hover zones for scrolling */}
          <div
            className="hidden md:block absolute left-0 top-0 bottom-0 w-32 z-10 cursor-w-resize"
            onMouseEnter={() => startScrolling('left')}
            onMouseLeave={stopScrolling}
          />
          <div
            className="hidden md:block absolute right-0 top-0 bottom-0 w-32 z-10 cursor-e-resize"
            onMouseEnter={() => startScrolling('right')}
            onMouseLeave={stopScrolling}
          />
        </div>

      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default UniversityLogos;
