import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    image: "SC",
    quote: "I went from 0 interviews to 5 offers in 3 months. CSLibrary showed me exactly what top companies look for in resumes.",
    companyLogo: "🔵"
  },
  {
    name: "Marcus Johnson",
    role: "Frontend Developer",
    company: "Meta",
    image: "MJ",
    quote: "The project examples were game-changing. I rebuilt my portfolio using their templates and landed my dream job at Meta.",
    companyLogo: "🔷"
  },
  {
    name: "Priya Patel",
    role: "ML Engineer",
    company: "Amazon",
    image: "PP",
    quote: "As an international student, I had no idea what US tech companies wanted. CSLibrary gave me the blueprint to success.",
    companyLogo: "🟠"
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Real Stories, Real Offers
          </h2>
          <p className="text-xl text-muted-foreground">
            From no interviews to big tech offers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="group p-8 rounded-2xl bg-background border-2 border-border hover:border-accent/50 hover:shadow-2xl transition-all duration-300"
            >
              <Quote className="h-8 w-8 text-accent mb-6" />
              
              <p className="text-lg text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at <span className="font-semibold text-accent">{testimonial.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
