import { Link } from "react-router-dom";
import { usePostHog } from "posthog-js/react";

const Footer = () => {
  const posthog = usePostHog();

  return (
    <footer className="bg-[#1a1a1a] text-white px-6 py-20 md:py-28">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16 md:gap-24">
        {/* Left: Logo and tagline */}
        <div className="flex flex-col gap-6 max-w-md">
          <div className="relative w-[36px] h-[36px] shrink-0">
            {/* Grey paper layer */}
            <div className="absolute w-8 h-8 rounded-xl bg-gray-600 bottom-0 right-0"></div>
            {/* White layer with C */}
            <div className="absolute w-8 h-8 rounded-xl bg-white flex items-center justify-center top-0 left-0 z-10">
              <span className="text-lg font-bold text-black">C</span>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Access real CS resumes, projects, and portfolios that landed offers at top tech companies.
          </p>
        </div>

        {/* Right: Links grid */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 text-sm font-semibold md:justify-self-end">
          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="hover:opacity-80 transition-opacity"
              onClick={() => posthog?.capture('footer_resumes_clicked')}
            >
              Resumes
            </Link>
            <Link
              to="/projects"
              className="hover:opacity-80 transition-opacity"
              onClick={() => posthog?.capture('footer_projects_clicked')}
            >
              Projects
            </Link>
            <span className="hover:opacity-80 transition-opacity cursor-default">
              Book a call
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:jessie@nativespeaking.ai"
              className="hover:opacity-80 transition-opacity"
              onClick={() => posthog?.capture('footer_contact_clicked')}
            >
              Contact
            </a>
          </div>
        </div>

        {/* Bottom row: Copyright and legal */}
        <div className="col-span-full flex flex-col md:flex-row justify-between gap-6 pt-8 border-t border-gray-800 text-xs text-gray-500">
          <p>© CookedCareer 2025. All rights reserved</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:opacity-80 transition-opacity">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:opacity-80 transition-opacity">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
