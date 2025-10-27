import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Settings, X, Upload } from "lucide-react";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { UpgradeButton } from "@/components/UpgradeButton";
import { ProBadge } from "@/components/ProBadge";
import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface DashboardNavProps {
  isPro: boolean;
  isLoadingSubscription?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  seniority?: string;
  onSeniorityChange?: (value: string) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  onMyResumeClick?: () => void;
  hasUploadedResume?: boolean;
  onUploadSuccess?: () => void;
}

export interface DashboardNavRef {
  triggerUpload: () => void;
}

const DashboardNav = forwardRef<DashboardNavRef, DashboardNavProps>(({
  isPro,
  isLoadingSubscription = false,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  seniority,
  onSeniorityChange,
  hasActiveFilters,
  onClearFilters,
  onMyResumeClick,
  hasUploadedResume = false,
  onUploadSuccess
}, ref) => {
  const location = useLocation();
  const isResumesPage = location.pathname === "/dashboard";
  const isProjectsPage = location.pathname === "/projects";
  const isAnonymizerPage = location.pathname === "/anonymizer";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { getToken } = useAuth();

  // Expose triggerUpload to parent via ref
  useImperativeHandle(ref, () => ({
    triggerUpload: () => {
      fileInputRef.current?.click();
    }
  }));

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Get Clerk JWT token
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required. Please sign in again.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user-resume/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: hasUploadedResume ? "Resume updated" : "Resume uploaded",
          description: hasUploadedResume ? "Your resume has been updated successfully!" : "Your resume has been saved successfully!",
        });
        // Notify parent of successful upload
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        throw new Error(data.detail || data.error || 'Upload failed');
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <nav className="bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-2 md:gap-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="relative w-[36px] h-[36px] shrink-0">
                {/* Grey paper layer (offset bottom-right) */}
                <div className="absolute w-8 h-8 rounded-xl bg-gray-300 bottom-0 right-0"></div>
                {/* Black layer with C */}
                <div className="absolute w-8 h-8 rounded-xl bg-[#1a1a1a] flex items-center justify-center top-0 left-0 z-10">
                  <span className="text-lg font-bold text-white">C</span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3 md:gap-6">
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
              <Link
                to="/anonymizer"
                className={`text-sm font-semibold transition-colors ${
                  isAnonymizerPage ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Anonymizer
              </Link>
            </div>
          </div>

          {/* Right: Upload Resume + Upgrade + Settings + Profile */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Upload Resume Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                if (onMyResumeClick) {
                  onMyResumeClick();
                } else {
                  fileInputRef.current?.click();
                }
              }}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">{isUploading ? 'Uploading...' : hasUploadedResume ? 'Resume Uploaded ✓' : 'My Resume'}</span>
            </Button>

            {isLoadingSubscription ? (
              <Skeleton className="hidden md:flex w-[160px] h-9 rounded-full" />
            ) : isPro ? (
              <>
                <ProBadge className="hidden md:flex" />
                <Link to="/account">
                  <Button variant="ghost" size="icon" className="w-9 h-9">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <UpgradeButton
                size="sm"
                className="hidden md:flex rounded-full text-sm font-semibold px-4 h-9 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
              />
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

        {/* Search + Filters - Full width below nav on mobile */}
        {onSearchChange && (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-10 md:h-12 pl-10 md:pl-11 rounded-full bg-muted border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {onSeniorityChange && seniority && (
                <>
                  <Select value={seniority} onValueChange={onSeniorityChange}>
                    <SelectTrigger className="w-[100px] md:w-[140px] h-10 md:h-12 rounded-full">
                      <SelectValue placeholder="Seniority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Seniority</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && onClearFilters && (
                    <Button
                      variant="ghost"
                      onClick={onClearFilters}
                      size="icon"
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

DashboardNav.displayName = 'DashboardNav';

export default DashboardNav;
