import twoSigmaScreenshot from "@/assets/testimonials/two-sigma-interview.png";

const testimonials = [
  {
    name: "Sarah Chen",
    school: "Stanford University",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    quote: "The resume examples helped me understand what top companies actually look for. I landed interviews at Google, Meta, and Amazon.",
  },
  {
    name: "Marcus Johnson",
    school: "University of Washington",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    quote: "This library showed me real examples from people who got hired. As an international student, it made all the difference.",
  },
  {
    name: "Priya Patel",
    school: "Caltech",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80",
    quote: "Seeing how others structured their technical descriptions helped me get my first offer at Tesla.",
  },
  {
    name: "David Kim",
    school: "USC",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
    quote: "I found resumes from students at my level who still landed great internships. It gave me a realistic roadmap to follow.",
  },
  {
    name: "Emily Rodriguez",
    school: "University of Maryland",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
    quote: "We can't imagine our job search process without this. The quality, clarity and precision it provides make it just as valuable as it is intuitive.",
  },
];

const successScreenshots = [
  {
    company: "Two Sigma",
    alt: "Two Sigma interview confirmation",
    image: twoSigmaScreenshot,
  },
];

const UniversityLogos = () => {
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
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
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
        </div>

        {/* Success Screenshots */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Real results from real students
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See the actual interview invitations our users received after using our library
            </p>
          </div>

          <div className="flex justify-center">
            {successScreenshots.map((screenshot, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-4xl"
              >
                <img
                  src={screenshot.image}
                  alt={screenshot.alt}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            ))}
          </div>
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
