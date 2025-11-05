import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import googleLogo from "@/assets/google-logo.png";
import metaLogo from "@/assets/meta-logo.png";
import amazonLogo from "@/assets/amazon-logo.png";
import microsoftLogo from "@/assets/microsoft-logo.png";
import netflixLogo from "@/assets/netflix-logo.png";
import appleLogo from "@/assets/apple-logo.svg";

// Import resume images
const resumeImages = import.meta.glob('@/assets/resumes/*.png', { eager: true, as: 'url' });

interface ResumeItem {
  id: number;
  image: string;
  name: string;
  company: string;
  type: 'resume' | 'project' | 'portfolio';
  tags: string[];
}

const companyLogos: Record<string, string> = {
  'Google': googleLogo,
  'Meta': metaLogo,
  'Amazon': amazonLogo,
  'Microsoft': microsoftLogo,
  'Netflix': netflixLogo,
  'Apple': appleLogo,
};

const ResumeCarousel = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Parse resume images from the imported files
  const resumes: ResumeItem[] = Object.entries(resumeImages).map(([path, url], index) => {
    const filename = path.split('/').pop()?.replace('.png', '') || '';
    const parts = filename.split('_');
    const company = parts.pop() || '';
    const name = parts.join(' ');

    // Extract company name (remove numbers in parentheses)
    const cleanCompany = company.replace(/\s*\(\d+\)/, '');

    return {
      id: index,
      image: url as string,
      name: name,
      company: cleanCompany,
      type: 'resume',
      tags: ['Software Engineer', 'Full Stack'],
    };
  }).filter(resume => !resume.image.includes('(1)')).slice(0, 10);  // Limit to 10 resumes

  // Track scroll position and update carousel offset based on section position
  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current) return;

        const sectionTop = sectionRef.current.offsetTop;
        const sectionHeight = sectionRef.current.offsetHeight;
        const windowScrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Calculate how far through the section we've scrolled
        const sectionStart = sectionTop - windowHeight;
        const sectionEnd = sectionTop + sectionHeight;
        const scrollProgress = (windowScrollY - sectionStart) / (sectionEnd - sectionStart);

        // Convert scroll progress to carousel offset
        const maxOffset = (resumes.length * 220) - (containerRef.current?.offsetWidth || 1200);
        const offset = Math.max(0, Math.min(maxOffset, scrollProgress * maxOffset * 2));

        setScrollOffset(offset);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [resumes.length]);

  // Calculate the height scale for each card based on distance from center
  const getCardHeight = (index: number) => {
    const containerWidth = containerRef.current?.offsetWidth || 1200;
    const cardWidth = 200; // Width of each card
    const spacing = 20; // Gap between cards
    const totalCardWidth = cardWidth + spacing;

    // Calculate the position of this card
    const cardPosition = index * totalCardWidth - scrollOffset;

    // Distance from center of viewport
    const centerPosition = containerWidth / 2;
    const distanceFromCenter = Math.abs(cardPosition + cardWidth / 2 - centerPosition);

    // Calculate height percentage (100% at center, decreasing with distance)
    const maxDistance = containerWidth / 2;
    const heightPercentage = Math.max(40, 100 - (distanceFromCenter / maxDistance) * 60);

    return heightPercentage;
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 overflow-hidden min-h-[120vh]"
    >
      <div className="w-full px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Learn From Resumes That Got Hired
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Study real applications that landed offers.
            <br />
            Learn formatting, bullet points, and quantification that actually works.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative h-[600px] w-full flex items-center justify-start overflow-hidden"
        >
          <div
            className="flex gap-5 items-center"
            style={{ transform: `translateX(${-scrollOffset}px)` }}
          >
            {resumes.map((resume, index) => {
              const heightPercent = getCardHeight(index);
              const maxHeight = 550; // Maximum height in pixels
              const height = (maxHeight * heightPercent) / 100;
              const width = height * 0.7; // Maintain aspect ratio (letter size is ~0.77)

              return (
                <div
                  key={resume.id}
                  className="flex-shrink-0 bg-muted rounded-2xl p-4 flex flex-col items-center gap-3"
                >
                  <div
                    className="relative bg-white rounded-xl overflow-hidden"
                    style={{
                      height: `${height}px`,
                      width: `${width}px`
                    }}
                  >
                    {/* Resume Image */}
                    <img
                      src={resume.image}
                      alt={`${resume.name}'s resume`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Company logo below */}
                  {companyLogos[resume.company] && (
                    <div className="bg-white rounded-lg p-2">
                      <img
                        src={companyLogos[resume.company]}
                        alt={`${resume.company} logo`}
                        className="h-6 w-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-16">
          <Link to="/auth">
            <Button size="lg" className="rounded-full font-bold text-lg px-10 h-14 shadow-lg hover:shadow-xl transition-shadow">
              Access to all samples
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResumeCarousel;
