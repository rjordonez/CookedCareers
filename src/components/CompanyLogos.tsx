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
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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

const CompanyLogos = () => {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} className="pt-6 pb-8 px-6 fade-in-fast -mt-64">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs md:text-sm font-medium tracking-wide text-muted-foreground mb-4">
          Our candidates have been hired at
        </p>

        <div className="relative overflow-hidden">
          {/* Left fade gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>

          {/* Right fade gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-scroll-logos whitespace-nowrap" style={{ width: 'max-content' }}>
            {/* First set of logos */}
            {companies.map((company, index) => (
              <div key={`${company.name}-1-${index}`} className="flex-none mx-8 inline-block">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-8 md:h-10 w-auto object-contain opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-200"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {companies.map((company, index) => (
              <div key={`${company.name}-2-${index}`} className="flex-none mx-8 inline-block">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-8 md:h-10 w-auto object-contain opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-logos {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-logos {
          animation: scroll-logos 50s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CompanyLogos;
