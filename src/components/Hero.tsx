import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SlotCounter from "react-slot-counter";
import { useState, useEffect } from "react";
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

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Trigger fade-in animation
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`px-6 pt-48 pb-16 fade-in ${visible ? 'visible' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="max-w-[400px] mx-auto text-center text-5xl font-bold tracking-tight leading-tight md:max-w-[600px] md:text-6xl lg:max-w-[900px] lg:text-7xl">
          Learn From Applications<br />That Landed Offers
        </h1>

        <p className="max-w-[450px] mx-auto pt-6 text-center text-lg text-muted-foreground md:max-w-[550px] md:text-xl lg:max-w-[700px]">
          Access{' '}
          <span className="inline-flex items-baseline">
            {mounted ? <SlotCounter value="1000" /> : '1000'}
            <span>+</span>
          </span>
          {' '}successful CS resumes, projects, and portfolios that landed jobs at top tech companies
        </p>

        <div className="pt-10 text-center">
          <Link to="/auth">
            <Button size="lg" className="rounded-full text-base font-semibold px-4 h-11 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
              Join for free
            </Button>
          </Link>
        </div>

        {/* Company Logos */}
        <div className="pt-16">
          <p className="text-center text-xs md:text-sm font-medium tracking-wide text-muted-foreground mb-6">
            Our candidates have been hired at
          </p>

          <div className="relative overflow-hidden max-w-4xl mx-auto">
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

export default Hero;