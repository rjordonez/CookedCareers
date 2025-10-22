import alexKumar from "@/assets/pfps/alex_kumar.jpeg";
import anaRodriguez from "@/assets/pfps/ana_rodriguez.jpeg";
import davidKim from "@/assets/pfps/david_kim.jpeg";
import emmaDavis from "@/assets/pfps/emma_davis.jpeg";
import michaelChen from "@/assets/pfps/michael-chen.jpeg";
import rachelThompson from "@/assets/pfps/rachel_thompson.jpeg";
import robertGarcia from "@/assets/pfps/robert_garcia.jpeg";
import sarahJohnson from "@/assets/pfps/sarah_johnson.jpeg";
import weiLi from "@/assets/pfps/wei_li.jpeg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ananya S.",
    school: "University of Illinois Urbana-Champaign (Master's, International)",
    quote: "I was getting ghosted after dozens of applications. Seeing real resumes that worked gave me hope. Just got my first interview invite!",
    photo: anaRodriguez,
  },
  {
    name: "Jason L.",
    school: "University of Texas at Austin",
    quote: "Had no idea why I wasn't getting replies. This showed me what actually works, and recruiters finally started noticing me.",
    photo: robertGarcia,
  },
  {
    name: "Priya K.",
    school: "University of Washington",
    quote: "Every application felt like a black hole. These examples gave me a clear path and I landed an interview immediately.",
    photo: sarahJohnson,
  },
  {
    name: "Wei C.",
    school: "Georgia Tech (Master's, International)",
    quote: "Months of silence made me feel stuck. Following guidance from successful candidates, I finally started getting responses.",
    photo: weiLi,
  },
  {
    name: "Sofia T.",
    school: "Purdue University",
    quote: "Desperately needed real examples. Seeing what worked helped me rewrite my resume and feel confident again.",
    photo: rachelThompson,
  },
  {
    name: "Marcus D.",
    school: "UC Berkeley",
    quote: "CookedCareer helped me understand what top companies actually look for. Landed 3 interviews in my first week.",
    photo: michaelChen,
  },
  {
    name: "Emily R.",
    school: "Carnegie Mellon",
    quote: "Finally got past the resume screening. The real examples showed me exactly what was missing from mine.",
    photo: emmaDavis,
  },
  {
    name: "David K.",
    school: "Stanford (International)",
    quote: "As an international student, I had no idea what worked in the US market. This database was a game changer.",
    photo: davidKim,
  },
  {
    name: "Jessica M.",
    school: "MIT",
    quote: "Studied successful resumes for a week, rewrote mine, and got responses from Amazon and Microsoft within days.",
    photo: sarahJohnson,
  },
  {
    name: "Alex T.",
    school: "Cornell University",
    quote: "The pattern recognition was instant. Saw what made candidates stand out and applied it. Interview rate went from 0% to 40%.",
    photo: alexKumar,
  },
  {
    name: "Kavya P.",
    school: "UT Austin (Master's)",
    quote: "Went from no responses to multiple offers. Learning from real examples beats any resume template.",
    photo: anaRodriguez,
  },
  {
    name: "Ryan W.",
    school: "UCLA",
    quote: "Best investment I made for my job search. Seeing what actually worked saved me months of trial and error.",
    photo: robertGarcia,
  },
];


const UniversityLogos = () => {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 px-6 bg-background fade-in">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center mb-16 text-3xl md:text-4xl lg:text-5xl font-bold">
          What our users are saying.
        </h2>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="mb-4 md:mb-6 break-inside-avoid"
            >
              <div className="bg-background rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.school}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed">{testimonial.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniversityLogos;
