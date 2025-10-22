import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Loader2, X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useAuthReady } from "@/components/AuthProvider";
import { useResumeFilters } from "@/hooks/useResumeFilters";
import { useSearchResumesQuery } from "@/features/resumes/resumeService";
import { useGetSubscriptionStatusQuery } from "@/features/subscription/subscriptionService";
import { ResumeDetailModal } from "@/components/ResumeDetailModal";
import { UpgradeButton } from "@/components/UpgradeButton";
import DashboardNav from "@/components/DashboardNav";
import type { Resume } from "@/features/resumes/resumeTypes";
import { usePostHog } from "posthog-js/react";

const FREE_PREVIEW_COUNT = 3;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const { authReady } = useAuthReady();
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const posthog = usePostHog();

  // Get filters from URL search params
  const {
    filters,
    apiParams,
    setSearchQuery: updateSearchQuery,
    setSeniority: updateSeniority,
    setSchool: updateSchool,
    setExperienceRange: updateExperienceRange,
    setCurrentPage: updateCurrentPage,
    resetFilters: clearFilters,
    hasActiveFilters,
  } = useResumeFilters();

  // Fetch resumes from API - skip until auth token getter is ready
  const { data, isLoading, isError, error } = useSearchResumesQuery(apiParams, {
    skip: !authReady || !isSignedIn,
    refetchOnMountOrArgChange: 60, // Only refetch if data is older than 60s
  });

  // Fetch subscription status separately (only once on mount)
  const { data: subscriptionData } = useGetSubscriptionStatusQuery(undefined, {
    skip: !authReady || !isSignedIn,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const isPro = subscriptionData?.is_active ?? false;

  // FAANG companies for prioritization
  const FAANG_COMPANIES = ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft'];

  // Sort resumes to show FAANG first
  const sortedResumes = data?.results ? [...data.results].sort((a, b) => {
    const aHasFaang = a.experience?.some(exp =>
      FAANG_COMPANIES.some(faang => exp.company?.toUpperCase().includes(faang.toUpperCase()))
    );
    const bHasFaang = b.experience?.some(exp =>
      FAANG_COMPANIES.some(faang => exp.company?.toUpperCase().includes(faang.toUpperCase()))
    );

    // FAANG resumes come first
    if (aHasFaang && !bHasFaang) return -1;
    if (!aHasFaang && bHasFaang) return 1;
    return 0;
  }) : [];

  // Sync local search with URL params on mount
  useEffect(() => {
    setLocalSearchQuery(filters.searchQuery);
  }, [filters.searchQuery]);

  useEffect(() => {
    if (isLoaded && !user) {
      navigate("/auth");
    }
  }, [isLoaded, user, navigate]);

  // Debounce search query - only update URL after 500ms of no typing
  // Skip if local query matches URL (prevents resetting page on pagination)
  useEffect(() => {
    if (localSearchQuery === filters.searchQuery) {
      return;
    }

    const timer = setTimeout(() => {
      updateSearchQuery(localSearchQuery);

      // Track search query in PostHog
      if (localSearchQuery.trim()) {
        posthog?.capture('dashboard_search', {
          search_query: localSearchQuery,
          user_id: user?.id,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, filters.searchQuery, updateSearchQuery, posthog, user?.id]);

  const handleClearFilters = () => {
    setLocalSearchQuery("");
    clearFilters();
  };

  const handleExperienceChange = (value: string) => {
    if (value === "all") {
      updateExperienceRange({ min: undefined, max: undefined });
    } else if (value === "0-3") {
      updateExperienceRange({ min: 0, max: 3 });
    } else if (value === "4-7") {
      updateExperienceRange({ min: 4, max: 7 });
    } else if (value === "8+") {
      updateExperienceRange({ min: 8, max: undefined });
    }
  };

  const getExperienceFilterValue = () => {
    if (filters.minExperience === undefined && filters.maxExperience === undefined) {
      return "all";
    } else if (filters.minExperience === 0 && filters.maxExperience === 3) {
      return "0-3";
    } else if (filters.minExperience === 4 && filters.maxExperience === 7) {
      return "4-7";
    } else if (filters.minExperience === 8 && filters.maxExperience === undefined) {
      return "8+";
    }
    return "all";
  };

  const isBlurred = (index: number) => {
    const globalIndex = (filters.currentPage - 1) * 20 + index;
    return !isPro && globalIndex >= FREE_PREVIEW_COUNT;
  };

  if (!isLoaded || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        isPro={isPro}
        searchQuery={localSearchQuery}
        onSearchChange={setLocalSearchQuery}
        searchPlaceholder="Search resumes by keywords..."
      />

      <main className="max-w-7xl mx-auto px-6 pt-4 pb-6">
        <div className="mb-6 space-y-4">
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="gap-2 shrink-0"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filters.seniority || "all"} onValueChange={(value) => updateSeniority(value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seniority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seniority</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid-level">Mid-Level</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="principal">Principal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.school || "all"} onValueChange={(value) => updateSchool(value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="School" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                <SelectItem value="Stanford">Stanford</SelectItem>
                <SelectItem value="MIT">MIT</SelectItem>
                <SelectItem value="UC Berkeley">UC Berkeley</SelectItem>
                <SelectItem value="Carnegie Mellon">Carnegie Mellon</SelectItem>
                <SelectItem value="Harvard">Harvard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={getExperienceFilterValue()} onValueChange={handleExperienceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience</SelectItem>
                <SelectItem value="0-3">0-3 years</SelectItem>
                <SelectItem value="4-7">4-7 years</SelectItem>
                <SelectItem value="8+">8+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!isPro && data && (
          <div className="mb-8 p-6 bg-muted/50 rounded-2xl text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-2">Unlock Full Access</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You're viewing {FREE_PREVIEW_COUNT} of {data.pagination.total} resumes. Upgrade to see them all for just $4.99/month.
              </p>
              <UpgradeButton size="default" />
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading resumes...</span>
          </div>
        )}

        {isError && (
          <Card className="p-8 text-center">
            <p className="text-destructive mb-2">Failed to load resumes</p>
            <p className="text-sm text-muted-foreground">
              {error && 'status' in error ? `Error: ${error.status}` : 'Please check your connection and try again'}
            </p>
          </Card>
        )}

        {!isLoading && !isError && data && data.results.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No resumes found matching your criteria</p>
          </Card>
        )}

        {!isLoading && !isError && data && sortedResumes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {sortedResumes.map((resume, index) => {
              const isResumeBlurred = isBlurred(index);
              return (
              <div key={resume.id} className="relative h-full">
                <Card
                  className="group overflow-hidden border-0 bg-muted rounded-2xl hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full"
                  onClick={() => !isResumeBlurred && setSelectedResume(resume)}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative p-4 flex items-center justify-center">
                    {resume.file_url ? (
                      <div className="w-full h-full bg-white overflow-hidden relative">
                        <object
                          data={`${resume.file_url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                          type="application/pdf"
                          className={`w-full h-full pointer-events-none ${
                            isResumeBlurred ? 'blur-md' : ''
                          }`}
                        >
                          <embed
                            src={`${resume.file_url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                            type="application/pdf"
                            className={`w-full h-full pointer-events-none ${
                              isResumeBlurred ? 'blur-md' : ''
                            }`}
                          />
                        </object>
                      </div>
                    ) : (
                      <div className={`w-full h-full bg-white flex items-center justify-center ${
                        isResumeBlurred ? 'blur-md' : ''
                      }`}>
                        <p className="text-muted-foreground">No preview available</p>
                      </div>
                    )}
                    {isResumeBlurred && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center p-4">
                          <Crown className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <p className="text-sm font-semibold mb-1">Premium Only</p>
                          <p className="text-xs text-muted-foreground">Upgrade to view</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-sm leading-tight">
                        {resume.title || resume.name || 'Untitled Resume'}
                      </h3>
                    </div>
                    {resume.education && resume.education.length > 0 && resume.education[0].institution && (
                      <p className="text-xs text-muted-foreground mb-3">{resume.education[0].institution}</p>
                    )}
                    <div className="flex flex-wrap gap-2 items-center">
                      {(() => {
                        const companyLogos: Record<string, string> = {
                          'Google': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png',
                          'Meta': 'https://brandlogos.net/wp-content/uploads/2021/10/meta-logo-512x512.png',
                          'Amazon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2880px-Amazon_logo.svg.png',
                          'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png',
                          'Apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png',
                          'Netflix': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png',
                        };

                        // Get company from experience array (check all companies)
                        const experienceCompanies = resume.experience?.map(exp => exp.company?.toUpperCase()) || [];
                        const companyWithLogo = Object.keys(companyLogos).find(company =>
                          experienceCompanies.some(expCompany => expCompany?.includes(company.toUpperCase()))
                        );

                        return companyWithLogo ? (
                          <img src={companyLogos[companyWithLogo]} alt={companyWithLogo} className="h-6 object-contain" />
                        ) : (
                          resume.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-md bg-secondary text-foreground"
                            >
                              {skill}
                            </span>
                          ))
                        );
                      })()}
                    </div>
                  </div>
                </Card>
              </div>
              );
            })}
          </div>
        )}

        {!isLoading && !isError && data && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => updateCurrentPage(Math.max(1, filters.currentPage - 1))}
              disabled={filters.currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {data.pagination.page} of {data.pagination.total_pages}
            </span>
            <Button
              variant="outline"
              onClick={() => updateCurrentPage(Math.min(data.pagination.total_pages, filters.currentPage + 1))}
              disabled={filters.currentPage === data.pagination.total_pages}
            >
              Next
            </Button>
          </div>
        )}
      </main>

      <ResumeDetailModal
        resume={selectedResume}
        isOpen={selectedResume !== null}
        onClose={() => setSelectedResume(null)}
        isPremium={isPro}
      />
    </div>
  );
};

export default Dashboard;
