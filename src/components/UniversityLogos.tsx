import stanfordLogo from "@/assets/universities/stanford.png";
import uscLogo from "@/assets/universities/usc.png";
import uwLogo from "@/assets/universities/uw.png";
import umdLogo from "@/assets/universities/umd.jpeg";
import caltechLogo from "@/assets/universities/caltech.png";
import purdueLogo from "@/assets/universities/purdue.png";
import sfsuLogo from "@/assets/universities/sfsu.png";
import sjsuLogo from "@/assets/universities/sjsu.png";

const universities = [
  { name: "Stanford University", logo: stanfordLogo },
  { name: "University of Southern California", logo: uscLogo },
  { name: "University of Washington", logo: uwLogo },
  { name: "University of Maryland", logo: umdLogo },
  { name: "Caltech", logo: caltechLogo },
  { name: "Purdue University", logo: purdueLogo },
  { name: "San Francisco State University", logo: sfsuLogo },
  { name: "San José State University", logo: sjsuLogo },
];

const UniversityLogos = () => {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by Students from Top Universities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of learners from universities around the world
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center mb-12">
          {universities.map((university) => (
            <div
              key={university.name}
              className="group flex items-center justify-center p-6 w-full h-24"
            >
              <img 
                src={university.logo} 
                alt={`${university.name} logo`}
                className="max-h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
              />
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
