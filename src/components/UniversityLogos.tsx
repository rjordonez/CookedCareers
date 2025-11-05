import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const testimonials = [
  {
    name: "Priya K.",
    school: "University of Maryland",
    title: "I was drowning in rejections",
    quote: "Honestly, every application felt like throwing my resume into a black hole. But these real examples gave me a clear path forward and boom - landed an interview right away. The difference was night and day."
  },
  {
    name: "Emily R.",
    school: "UCLA",
    title: "Finally broke through the ATS wall",
    quote: "I kept getting auto-rejected and had no clue why. Looking at actual resumes that worked showed me exactly what I was missing. Within a week of fixing mine, recruiters started reaching out. Game changer."
  },
  {
    name: "Kavya P.",
    school: "USC",
    title: "This beat every template I tried",
    quote: "I wasted so much time on generic resume templates. Seeing real examples from people who actually got hired was completely different - I could finally understand what worked and why. Went from zero offers to multiple."
  },
  {
    name: "Wei C.",
    school: "Northwestern University",
    title: "Broke my months-long dry spell",
    quote: "Months of silence were killing my confidence. I didn't know what I was doing wrong. Studying how successful candidates positioned their experience changed everything - finally started hearing back from companies."
  },
  {
    name: "David K.",
    school: "NYU",
    title: "Perfect for international students",
    quote: "Coming from abroad, I had zero idea what US companies wanted to see. This database was exactly what I needed - real resumes from people who made it. Gave me the confidence I was missing."
  },
  {
    name: "Ryan W.",
    school: "Boston College",
    title: "Saved me months of guessing",
    quote: "Best money I ever spent on job searching. I went from basically no responses to getting callbacks from 35% of my applications. Just seeing what actually worked instead of guessing made all the difference."
  },
];


const UniversityLogos = () => {
  const ref = useScrollAnimation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 356; // Card width (340px) + gap (16px)
      const newScrollLeft = scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section ref={ref} className="py-24 px-6 bg-background fade-in overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center mb-12 text-3xl md:text-4xl lg:text-5xl font-bold">
          What Our Users Are Saying
        </h2>

        {/* Horizontal Scrolling Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background border border-border rounded-full p-2 shadow-lg hover:bg-muted transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background border border-border rounded-full p-2 shadow-lg hover:bg-muted transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-12"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[340px] snap-start"
              >
                <div className="bg-muted/30 rounded-2xl p-6 h-full border border-border hover:shadow-lg transition-shadow">
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base mb-3 leading-tight">
                    {testimonial.title}
                  </h3>

                  {/* Quote */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {testimonial.quote}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-border mb-4"></div>

                  {/* Name and School */}
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversityLogos;
