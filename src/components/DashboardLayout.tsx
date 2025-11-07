import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { UpgradeButton } from "@/components/UpgradeButton";
import { ProBadge } from "@/components/ProBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLayoutProps {
  children: ReactNode;
  isPro: boolean;
  isLoadingSubscription?: boolean;
}

const DashboardLayout = ({
  children,
  isPro,
  isLoadingSubscription = false,
}: DashboardLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/resumes", label: "Resumes" },
    { path: "/projects", label: "Projects" },
    { path: "/anonymizer", label: "Anonymizer" },
    { path: "/ats-checker", label: "ATS Checker" },
    { path: "/resume-review", label: "Review" },
  ];

  const isActive = (path: string) => {
    if (path === "/resume-review") {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    }
    if (path === "/ats-checker") {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background sticky top-0 h-screen flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <Link to="/resumes" className="flex items-center gap-2">
            <div className="relative w-[36px] h-[36px] shrink-0">
              {/* Grey paper layer (offset bottom-right) */}
              <div className="absolute w-8 h-8 rounded-xl bg-gray-300 bottom-0 right-0"></div>
              {/* Black layer with C */}
              <div className="absolute w-8 h-8 rounded-xl bg-[#1a1a1a] flex items-center justify-center top-0 left-0 z-10">
                <span className="text-lg font-bold text-white">C</span>
              </div>
            </div>
            <span className="font-bold text-xl">Cooked</span>
          </Link>
        </div>

        {/* Create Resume Button */}
        <div className="p-4">
          <Link to="/dashboard">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10">
              <Plus className="w-4 h-4 mr-2" />
              Create Resume
            </Button>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 pt-0">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Section - Upgrade/Pro Badge + Settings + User */}
        <div className="p-4 border-t space-y-3">
          {isLoadingSubscription ? (
            <Skeleton className="w-full h-9 rounded-full" />
          ) : isPro ? (
            <div className="flex items-center justify-between">
              <ProBadge />
              <Link to="/account">
                <Button variant="ghost" size="icon" className="w-9 h-9">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <UpgradeButton
              size="sm"
              className="w-full rounded-full text-sm font-semibold px-4 h-9 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
            />
          )}
          <div className="flex justify-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9"
                }
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
