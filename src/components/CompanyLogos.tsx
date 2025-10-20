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

const CompanyLogos = () => {
  return (
    <section className="pt-6 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs md:text-sm font-medium tracking-wide text-muted-foreground mb-4">
          Our candidates have been hired at
        </p>

        <div className="overflow-x-auto">
          <div className="flex items-center gap-8 md:gap-10 lg:gap-12 snap-x">
            {companies.map((company) => (
              <div key={company.name} className="shrink-0 snap-start">
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
    </section>
  );
};

export default CompanyLogos;
