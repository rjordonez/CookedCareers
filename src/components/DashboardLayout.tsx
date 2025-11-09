import { Link, useLocation } from "react-router-dom";
import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Plus, Menu, X, LayoutDashboard, Library, Shield, FileCheck, MessageSquare, Sun, Moon, Heart, Zap } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { UpgradeButton } from "@/components/UpgradeButton";
import { ProBadge } from "@/components/ProBadge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navItems = [
    { path: "/resumes", label: "Library", icon: Library },
    { path: "/anonymizer", label: "Anonymizer", icon: Shield },
    { path: "/ats-checker", label: "ATS Checker", icon: FileCheck },
    { path: "/resume-review", label: "Review", icon: MessageSquare },
    { path: "#", label: "Auto Apply", icon: Zap, comingSoon: true },
  ];

  const isActive = (path: string) => {
    if (path === "/resume-review") {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    }
    if (path === "/ats-checker") {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    }
    if (path === "/resumes") {
      return location.pathname === "/resumes" || location.pathname === "/projects";
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Top Navigation Bar - Only profile/subscription */}
      <div className="hidden md:block fixed top-0 left-64 right-0 z-50 bg-background border-b px-6 py-3">
        <div className="flex items-center justify-end gap-3">
          {isLoadingSubscription ? (
            <Skeleton className="w-16 h-7 rounded-full" />
          ) : isPro ? (
            <ProBadge className="text-xs px-2 py-1" />
          ) : (
            <UpgradeButton
              size="sm"
              className="rounded-full text-xs font-semibold px-3 h-7 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-8 h-8"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          {/* Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="w-9 h-9"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo */}
          <Link to="/resumes" className="flex items-center gap-2">
            <div className="relative w-[32px] h-[32px] shrink-0">
              <div className="absolute w-7 h-7 rounded-xl bg-gray-300 dark:bg-gray-600 bottom-0 right-0"></div>
              <div className="absolute w-7 h-7 rounded-xl bg-[#1a1a1a] dark:bg-white flex items-center justify-center top-0 left-0 z-10">
                <span className="text-base font-bold text-white dark:text-[#1a1a1a]">C</span>
              </div>
            </div>
            <span className="font-normal text-lg">Cooked Careers</span>
          </Link>

          {/* Right Side - Pro Badge + Theme Toggle + User Button */}
          <div className="flex items-center gap-2">
            {isLoadingSubscription ? (
              <Skeleton className="w-16 h-7 rounded-full" />
            ) : isPro ? (
              <ProBadge className="text-xs px-2 py-1" />
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9"
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-full p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-left">
                <Link to="/resumes" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="relative w-[36px] h-[36px] shrink-0">
                    <div className="absolute w-8 h-8 rounded-xl bg-gray-300 dark:bg-gray-600 bottom-0 right-0"></div>
                    <div className="absolute w-8 h-8 rounded-xl bg-[#1a1a1a] dark:bg-white flex items-center justify-center top-0 left-0 z-10">
                      <span className="text-lg font-bold text-white dark:text-[#1a1a1a]">C</span>
                    </div>
                  </div>
                  <span className="font-normal text-xl">Cooked Careers</span>
                </Link>
              </SheetTitle>
            </SheetHeader>

            {/* Create Resume Button */}
            <div className="p-4">
              <Link to="/resume-builder" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Resume
                </Button>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 pt-0">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  if (item.comingSoon) {
                    return (
                      <div
                        key={item.path}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-muted-foreground cursor-not-allowed opacity-60"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </div>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Soon</span>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive(item.path)
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Bottom Section - Upgrade/Settings */}
            <div className="p-4 border-t space-y-3">
              {isLoadingSubscription ? (
                <Skeleton className="w-full h-9 rounded-full" />
              ) : isPro ? (
                <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-10">
                    <Settings className="w-5 h-5 mr-2" />
                    Account Settings
                  </Button>
                </Link>
              ) : (
                <UpgradeButton
                  size="sm"
                  className="w-full rounded-full text-sm font-semibold px-4 h-9 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-background sticky top-0 h-screen flex-col">
        {/* Logo */}
        <div className="px-6 py-3 border-b">
          <Link to="/resumes" className="flex items-center gap-2">
            <div className="relative w-[32px] h-[32px] shrink-0">
              {/* Grey paper layer (offset bottom-right) */}
              <div className="absolute w-7 h-7 rounded-xl bg-gray-300 dark:bg-gray-600 bottom-0 right-0"></div>
              {/* Black/White layer with C */}
              <div className="absolute w-7 h-7 rounded-xl bg-[#1a1a1a] dark:bg-white flex items-center justify-center top-0 left-0 z-10">
                <span className="text-base font-bold text-white dark:text-[#1a1a1a]">C</span>
              </div>
            </div>
            <span className="font-normal text-lg">Cooked Careers</span>
          </Link>
        </div>

        {/* Create Resume Button */}
        <div className="p-4">
          <Link to="/resume-builder">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10">
              <Plus className="w-4 h-4 mr-2" />
              Create Resume
            </Button>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 pt-0">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.comingSoon) {
                return (
                  <div
                    key={item.path}
                    className="flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground cursor-not-allowed opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Soon</span>
                  </div>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section - Preferences + Made with love */}
        <div className="p-4 border-t space-y-3">
          <Link to="/account">
            <Button variant="ghost" className="w-full h-10 justify-start">
              <Settings className="w-5 h-5 mr-2" />
              Your Preferences
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <span>Made with</span>
            <Heart className={`w-3 h-3 ${theme === 'dark' ? 'fill-white text-white' : 'fill-black text-black'}`} />
            <span>by Cooked Careers</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:pt-[52px]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
