import { useState } from "react";

const companies = [
  { name: "Google", color: "#4285F4" },
  { name: "Meta", color: "#0081FB" },
  { name: "Amazon", color: "#FF9900" },
  { name: "NVIDIA", color: "#76B900" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Netflix", color: "#E50914" },
  { name: "Apple", color: "#000000" },
];

const LogoStrip = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-6 border-y border-border bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-8 font-medium">
          Students using CSLibrary got jobs at
        </p>
        
        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center">
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
                  flex items-center justify-center h-12 px-6 rounded-xl
                  transition-all duration-300
                  ${hoveredIndex === index ? 'scale-110' : 'scale-100'}
                `}
              >
                <span
                  className="text-2xl font-bold transition-all duration-300"
                  style={{
                    color: hoveredIndex === index ? company.color : undefined,
                  }}
                >
                  {company.name === "Meta" && (
                    <svg width="80" height="32" viewBox="0 0 80 32" fill="none" className="transition-colors duration-300">
                      <path
                        d="M15 8C12 8 10 11 10 16C10 21 12 24 15 24C18 24 20 21 20 16C20 11 18 8 15 8Z"
                        fill="currentColor"
                        className={hoveredIndex === index ? "" : "opacity-40"}
                      />
                      <text x="28" y="20" className="font-bold text-lg" fill="currentColor" opacity={hoveredIndex === index ? "1" : "0.4"}>
                        Meta
                      </text>
                    </svg>
                  )}
                  {company.name === "Google" && (
                    <span className={`font-bold text-xl ${hoveredIndex === index ? '' : 'opacity-40'}`}>
                      Google
                    </span>
                  )}
                  {company.name === "Amazon" && (
                    <span className={`font-bold text-xl ${hoveredIndex === index ? '' : 'opacity-40'}`}>
                      amazon
                    </span>
                  )}
                  {company.name === "NVIDIA" && (
                    <span className={`font-bold text-xl ${hoveredIndex === index ? '' : 'opacity-40'}`}>
                      NVIDIA
                    </span>
                  )}
                  {company.name === "Microsoft" && (
                    <span className={`font-bold text-xl ${hoveredIndex === index ? '' : 'opacity-40'}`}>
                      Microsoft
                    </span>
                  )}
                  {company.name === "Netflix" && (
                    <span className={`font-bold text-xl ${hoveredIndex === index ? '' : 'opacity-40'}`}>
                      NETFLIX
                    </span>
                  )}
                  {company.name === "Apple" && (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="transition-colors duration-300">
                      <path
                        d="M22 10C21 10 20 11 19 11C18 11 17 10 16 10C14 10 12 11 11 13C10 15 10 18 12 21C13 22 14 23 15 23C16 23 16 22 17 22C18 22 18 23 19 23C20 23 21 22 22 21C23 19 23 18 23 17C23 14 21 13 20 13C20 12 21 11 22 10ZM18 8C18 7 19 6 20 6C20 7 20 8 19 9C18 9 18 9 18 8Z"
                        fill="currentColor"
                        className={hoveredIndex === index ? "" : "opacity-40"}
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-6 px-6">
          <div className="flex gap-8 pb-2" style={{ minWidth: 'max-content' }}>
            {companies.map((company, index) => (
              <div
                key={company.name}
                className="flex items-center justify-center shrink-0"
                style={{
                  animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <span className="text-xl font-bold opacity-40" style={{ color: company.color }}>
                  {company.name}
                </span>
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
