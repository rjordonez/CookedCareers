import { useEffect, useRef, useState } from "react";
import { FileText, ScanLine } from "lucide-react";

const WhySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleStatements, setVisibleStatements] = useState<number[]>([]);

  const statements = [
    "Your resume is everything.",
    "Recruiters scan in seconds.",
    "Most get rejected unread.",
    "See what actually works.",
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress through the section (0 to 1)
      const progress = Math.max(
        0,
        Math.min(1, (windowHeight - rect.top) / windowHeight)
      );

      // Show statements progressively based on scroll
      const numVisible = Math.floor(progress * (statements.length + 1));
      setVisibleStatements(Array.from({ length: numVisible }, (_, i) => i));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [statements.length]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        {/* Left Icon - Resume */}
        <div className="hidden lg:block absolute left-[15%] top-[30%] -translate-y-1/2 rotate-[-12deg]">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl">
            <FileText className="w-12 h-12 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Right Icon - Scan */}
        <div className="hidden lg:block absolute right-[15%] top-[50%] -translate-y-1/2 rotate-[12deg]">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-2xl">
            <ScanLine className="w-12 h-12 text-white" strokeWidth={2} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-12">
          {statements.map((statement, index) => (
            <div
              key={index}
              className="transition-all duration-700 ease-out"
              style={{
                opacity: visibleStatements.includes(index) ? 1 : 0,
                transform: visibleStatements.includes(index) ? 'translateY(0)' : 'translateY(30px)',
              }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center leading-tight px-4">
                {statement}
              </h2>
            </div>
          ))}

          <div
            className="pt-8 transition-all duration-700 ease-out"
            style={{
              opacity: visibleStatements.length > statements.length ? 1 : 0,
              transform: visibleStatements.length > statements.length ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            <div className="bg-muted/50 rounded-2xl p-8 text-center max-w-3xl mx-auto">
              <p className="text-lg md:text-xl leading-relaxed">
                <span className="font-bold">Get your resume ATS-scanned correctly every time.</span> Increase your interview rate 4x with 1,000+ real resumes that landed offers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhySection;
