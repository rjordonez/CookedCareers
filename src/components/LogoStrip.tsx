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

// Split into 3 rows for the marquee effect
const row1 = companies.slice(0, 4);
const row2 = companies.slice(4, 7);
const row3 = companies.slice(7, 10);

const MarqueeRow = ({ companies, reverse = false }: { companies: typeof row1; reverse?: boolean }) => {
  return (
    <div className="relative flex overflow-hidden">
      <div 
        className={`flex gap-8 animate-marquee ${reverse ? 'animate-marquee-reverse' : ''}`}
        style={{ animationDuration: '40s' }}
      >
        {[...companies, ...companies, ...companies].map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className="flex items-center gap-3 px-6 py-3 bg-background border border-border rounded-2xl hover:border-accent/50 hover:shadow-lg transition-all duration-300 whitespace-nowrap shrink-0"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-muted shrink-0">
              <img 
                src={company.logo} 
                alt={`${company.name} logo`}
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-base font-semibold text-foreground">{company.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LogoStrip = () => {
  return (
    <section className="py-16 px-6 border-y border-border bg-secondary/30 overflow-hidden">
      <div className="max-w-full mx-auto">
        <p className="text-center text-lg text-foreground mb-12 font-semibold">
          Our candidates have been hired at:
        </p>
        
        <div className="flex flex-col gap-6">
          <MarqueeRow companies={row1} />
          <MarqueeRow companies={row2} reverse />
          <MarqueeRow companies={row3} />
        </div>
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
        
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        
        .animate-marquee-reverse {
          animation: marquee-reverse 40s linear infinite;
        }
        
        .animate-marquee:hover,
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default LogoStrip;
