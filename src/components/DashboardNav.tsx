import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Settings } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { UpgradeButton } from "@/components/UpgradeButton";
import { ProBadge } from "@/components/ProBadge";

interface DashboardNavProps {
  isPro: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

const DashboardNav = ({ isPro, searchQuery = "", onSearchChange, searchPlaceholder = "Search..." }: DashboardNavProps) => {
  const location = useLocation();
  const isResumesPage = location.pathname === "/dashboard";
  const isProjectsPage = location.pathname === "/projects";

  return (
    <nav className="bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-[36px] h-[36px] shrink-0">
                {/* Grey paper layer (offset bottom-right) */}
                <div className="absolute w-8 h-8 rounded-xl bg-gray-300 bottom-0 right-0"></div>
                {/* Black layer with C */}
                <div className="absolute w-8 h-8 rounded-xl bg-[#1a1a1a] flex items-center justify-center top-0 left-0 z-10">
                  <span className="text-lg font-bold text-white">C</span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4 md:gap-6">
              <Link
                to="/dashboard"
                className={`text-sm font-semibold transition-colors ${
                  isResumesPage ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Resumes
              </Link>
              <Link
                to="/projects"
                className={`text-sm font-semibold transition-colors ${
                  isProjectsPage ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Projects
              </Link>
            </div>
          </div>

          {/* Right: Upgrade + Settings + Profile */}
          <div className="flex items-center gap-3 md:gap-4">
            {isPro ? (
              <>
                <ProBadge />
                <Link to="/account">
                  <Button variant="ghost" size="icon" className="w-9 h-9">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <Button size="sm" className="hidden md:flex rounded-full text-sm font-semibold px-4 h-9 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                Get Pro
              </Button>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9"
                }
              }}
            />
          </div>
        </div>

        {/* Center: Search - Full width on mobile, centered on desktop */}
        {onSearchChange && (
          <div className="mt-4 md:mt-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-4 md:w-full md:max-w-lg md:px-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-10 md:h-12 pl-11 rounded-full bg-muted border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNav;
