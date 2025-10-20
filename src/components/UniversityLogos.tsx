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
    <section className="py-24 px-6 bg-muted/50 overflow-hidden">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Trusted by Students from Top Universities
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Join thousands of learners from universities around the world
          </p>
        </div>

        {/* Horizontal scrolling marquee */}
        <div className="relative flex overflow-hidden mb-12">
          <div className="flex gap-12 animate-marquee" style={{ animationDuration: '30s' }}>
            {[...universities, ...universities, ...universities].map((university, index) => (
              <div
                key={`${university.name}-${index}`}
                className="flex items-center justify-center px-8 py-6 bg-background rounded-xl hover:shadow-lg transition-all duration-300 shrink-0"
              >
                <img 
                  src={university.logo} 
                  alt={`${university.name} logo`}
                  className="h-14 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Whether you're studying in the US, Canada, or Asia — our library helps you level up your resume and land interviews.
        </p>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default UniversityLogos;
