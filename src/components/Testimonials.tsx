import sarahChenPhoto from "@/assets/testimonials/sarah-chen.jpg";
import marcusJohnsonPhoto from "@/assets/testimonials/marcus-johnson.jpg";
import priyaPatelPhoto from "@/assets/testimonials/priya-patel.jpg";
import alexKimPhoto from "@/assets/testimonials/alex-kim.jpg";
import jordanTaylorPhoto from "@/assets/testimonials/jordan-taylor.jpg";
import samRiveraPhoto from "@/assets/testimonials/sam-rivera.jpg";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    photo: sarahChenPhoto,
    quote: "I went from 0 interviews to 5 offers in 3 months. CSLibrary showed me exactly what top companies look for."
  },
  {
    name: "Marcus Johnson",
    role: "Frontend Developer", 
    company: "Meta",
    photo: marcusJohnsonPhoto,
    quote: "The project examples were game-changing. I rebuilt my portfolio using their templates and landed my dream job."
  },
  {
    name: "Priya Patel",
    role: "ML Engineer",
    company: "Amazon",
    photo: priyaPatelPhoto,
    quote: "As an international student, I had no idea what US tech companies wanted. CSLibrary gave me the blueprint to success."
  },
  {
    name: "Alex Kim",
    role: "Backend Engineer",
    company: "Microsoft",
    photo: alexKimPhoto,
    quote: "Every resume I looked at taught me something new. Now I'm at Microsoft building products that millions use."
  },
  {
    name: "Jordan Taylor",
    role: "Full Stack Developer",
    company: "Netflix",
    photo: jordanTaylorPhoto,
    quote: "CSLibrary is like having a mentor who already went through the entire hiring process. Absolutely invaluable resource."
  },
  {
    name: "Sam Rivera",
    role: "Data Scientist",
    company: "Apple",
    photo: samRiveraPhoto,
    quote: "Studying successful resumes helped me understand what actually matters. Landed my dream role at Apple in 4 months."
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          What our users are saying.
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={testimonial.photo} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
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
