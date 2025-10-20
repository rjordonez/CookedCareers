import { useState } from "react";
import googleLogo from "@/assets/google-logo.png";
import metaLogo from "@/assets/meta-logo.png";
import amazonLogo from "@/assets/amazon-logo.png";
import nvidiaLogo from "@/assets/nvidia-logo.svg";
import microsoftLogo from "@/assets/microsoft-logo.png";
import netflixLogo from "@/assets/netflix-logo.png";
import appleLogo from "@/assets/apple-logo.svg";
import lyftLogo from "@/assets/lyft-logo.png";
import doordashLogo from "@/assets/doordash-logo.png";
import twosigmaLogo from "@/assets/twosigma-logo.png";

const companies = [
  { name: "Google", logo: googleLogo },
  { name: "Meta", logo: metaLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "NVIDIA", logo: nvidiaLogo },
  { name: "Microsoft", logo: microsoftLogo },
  { name: "Netflix", logo: netflixLogo },
  { name: "Apple", logo: appleLogo },
  { name: "Lyft", logo: lyftLogo },
  { name: "DoorDash", logo: doordashLogo },
  { name: "Two Sigma", logo: twosigmaLogo },
];

const LogoStrip = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-6 border-y border-border bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-lg text-foreground mb-12 font-semibold">
          Our candidates have been hired at:
        </p>
        
        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-5 gap-12 items-center justify-items-center">
          {companies.map((company, index) => (
            <div
              key={company.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative transition-all duration-300"
              style={{
                animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <div
                className={`
                  flex items-center justify-center h-16 px-6 rounded-xl
                  transition-all duration-300
                  ${hoveredIndex === index ? 'scale-110' : 'scale-100'}
                `}
              >
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`} 
                  className={`h-10 w-auto object-contain transition-all duration-300 ${
                    hoveredIndex === index ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-6 px-6">
          <div className="flex gap-12 pb-2" style={{ minWidth: 'max-content' }}>
            {companies.map((company, index) => (
              <div
                key={company.name}
                className="flex items-center justify-center shrink-0"
                style={{
                  animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`} 
                  className="h-8 w-auto object-contain opacity-50 grayscale"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
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

export default LogoStrip;
