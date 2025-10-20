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
    <section className="py-24 px-6 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            🚀 Where Our Candidates Land
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our learners now work at the world's leading tech companies.<br />
            They started just like you — now they're building products billions use.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {companies.map((company) => (
            <div
              key={company.name}
              className="group flex items-center justify-center p-6 rounded-2xl bg-background border border-border hover:border-accent/50 hover:shadow-2xl hover:scale-110 transition-all duration-300 w-full h-32"
            >
              <img 
                src={company.logo} 
                alt={`${company.name} logo`}
                className="max-h-12 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos;
