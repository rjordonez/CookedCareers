const universities = [
  { name: "Stanford University", abbr: "Stanford" },
  { name: "MIT", abbr: "MIT" },
  { name: "UC Berkeley", abbr: "Berkeley" },
  { name: "Carnegie Mellon", abbr: "CMU" },
  { name: "UCLA", abbr: "UCLA" },
  { name: "USC", abbr: "USC" },
  { name: "University of Waterloo", abbr: "Waterloo" },
  { name: "Georgia Tech", abbr: "GT" },
  { name: "UT Austin", abbr: "UT" },
  { name: "UIUC", abbr: "UIUC" },
];

const UniversityLogos = () => {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            🎓 Trusted by Students from Top Universities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of learners from universities like:
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {universities.map((university) => (
            <div
              key={university.name}
              className="group flex items-center justify-center p-6 rounded-2xl bg-background border border-border hover:border-accent/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <span className="text-2xl font-bold text-accent">{university.abbr.charAt(0)}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{university.abbr}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Whether you're studying in the US, Canada, or Asia — our library helps you level up your resume and land interviews.
        </p>
      </div>
    </section>
  );
};

export default UniversityLogos;
