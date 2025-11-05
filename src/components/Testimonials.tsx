import sarahJohnson from '@/assets/pfps/sarah_johnson.jpeg';
import michaelChen from '@/assets/pfps/michael-chen.jpeg';
import anaRodriguez from '@/assets/pfps/ana_rodriguez.jpeg';
import davidKim from '@/assets/pfps/david_kim.jpeg';
import rachelThompson from '@/assets/pfps/rachel_thompson.jpeg';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    image: sarahJohnson,
    quote: "I went from 0 interviews to 5 offers in 3 months. CookedCareer showed me exactly what top companies look for."
  },
  {
    name: "Michael Chen",
    role: "Frontend Developer",
    company: "Meta",
    image: michaelChen,
    quote: "The project examples were game-changing. I rebuilt my portfolio using their templates and landed my dream job."
  },
  {
    name: "Ana Rodriguez",
    role: "ML Engineer",
    company: "Amazon",
    image: anaRodriguez,
    quote: "As an international student, I had no idea what US tech companies wanted. CookedCareer gave me the blueprint to success."
  },
  {
    name: "David Kim",
    role: "Backend Engineer",
    company: "Microsoft",
    image: davidKim,
    quote: "Every resume I looked at taught me something new. Now I'm at Microsoft building products that millions use."
  },
  {
    name: "Rachel Thompson",
    role: "Full Stack Developer",
    company: "Netflix",
    image: rachelThompson,
    quote: "CookedCareer is like having a mentor who already went through the entire hiring process. Absolutely invaluable resource."
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-6 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center mb-16">
          What Our Users Are Saying
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col p-6 bg-background rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                {testimonial.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
