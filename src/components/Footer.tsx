import { Link } from "react-router-dom";
import { usePostHog } from "posthog-js/react";
import { Button } from "@/components/ui/button";
import { Globe, Linkedin } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

const Footer = () => {
  const posthog = usePostHog();

  const productLinks = [
    { label: "Resume Examples", path: "/dashboard", event: "footer_resumes_clicked" },
    { label: "ATS Checker", path: "/dashboard", event: "footer_ats_clicked" },
    { label: "Expert Review", path: "/dashboard", event: "footer_expert_clicked" },
    { label: "Project Portfolios", path: "/projects", event: "footer_projects_clicked" }
  ];

  const resourceLinks = [
    { label: "How It Works", path: "/dashboard", event: "footer_how_it_works_clicked" },
    { label: "Success Stories", path: "/dashboard", event: "footer_testimonials_clicked" },
    { label: "Get Help", path: "/dashboard", event: "footer_help_clicked" }
  ];

  const companyLinks = [
    { label: "Our Story", path: "/dashboard", event: "footer_about_clicked" },
    { label: "Contact Us", href: "mailto:cookedcareer@gmail.com", event: "footer_contact_clicked" },
    { label: "Terms & Privacy", path: "/privacy", event: "footer_legal_clicked" }
  ];

  const socialLinks = [
    { name: "Website", icon: <Globe className="w-5 h-5" />, url: "https://cookedcareer.com", event: "footer_website_clicked" },
    { name: "TikTok", icon: <TikTokIcon />, url: "https://cookedcareer.com", event: "footer_tiktok_clicked" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, url: "https://cookedcareer.com", event: "footer_linkedin_clicked" },
    { name: "Reddit", icon: <RedditIcon />, url: "https://cookedcareer.com", event: "footer_reddit_clicked" }
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-6">
            <div className="relative w-[36px] h-[36px] shrink-0">
              {/* Grey paper layer */}
              <div className="absolute w-8 h-8 rounded-xl bg-gray-600 bottom-0 right-0"></div>
              {/* White layer with C */}
              <div className="absolute w-8 h-8 rounded-xl bg-white flex items-center justify-center top-0 left-0 z-10">
                <span className="text-lg font-bold text-black">C</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Access real CS resumes, projects, and portfolios that landed offers at top tech companies.
            </p>
            <Link to="/auth">
              <Button
                size="sm"
                className="rounded-full bg-white text-black hover:bg-gray-200 w-fit"
                onClick={() => posthog?.capture('footer_cta_clicked')}
              >
                Join Now
              </Button>
            </Link>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="font-semibold text-base mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                    onClick={() => posthog?.capture(link.event)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-semibold text-base mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                    onClick={() => posthog?.capture(link.event)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="font-semibold text-base mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                      onClick={() => posthog?.capture(link.event)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path!}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                      onClick={() => posthog?.capture(link.event)}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2025 CookedCareer</p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={social.name}
                onClick={() => posthog?.capture(social.event)}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
