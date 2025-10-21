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

const FREE_PREVIEW_COUNT = 3;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const { authReady } = useAuthReady();
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

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
  const isPro = subscriptionData?.is_pro || false;

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
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, filters.searchQuery, updateSearchQuery]);

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
          <Card className="mb-8 p-8 bg-background border-border text-center">
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-xl font-semibold">Unlock Full Access</h3>
              <p className="text-base text-muted-foreground">
                You're viewing {FREE_PREVIEW_COUNT} of {data.pagination.total} resumes. Upgrade to see them all for just $4.99/month.
              </p>
              <UpgradeButton size="lg" className="w-full sm:w-auto" />
            </div>
          </Card>
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

        {!isLoading && !isError && data && data.results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {data.results.map((resume, index) => {
              const isResumeBlurred = isBlurred(index);
              return (
              <div key={resume.id} className="relative">
                <Card
                  className="group overflow-hidden border border-border hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-card"
                  onClick={() => !isResumeBlurred && setSelectedResume(resume)}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-white to-gray-50 overflow-hidden relative border-b">
                    <div className={`w-full h-full p-6 flex flex-col ${
                      isResumeBlurred ? 'blur-md' : ''
                    }`}>
                      {/* Header */}
                      <div className="mb-6 pb-4 border-b-2 border-gray-200">
                        <h4 className="font-bold text-2xl text-gray-900 mb-2 line-clamp-1">
                          {resume.name || 'Candidate'}
                        </h4>
                        {resume.title && (
                          <p className="text-base text-gray-600 line-clamp-1">{resume.title}</p>
                        )}
                        {resume.location && (
                          <p className="text-base text-gray-500 mt-1.5 line-clamp-1">{resume.location}</p>
                        )}
                      </div>

                      {/* Experience Preview */}
                      {resume.experience && resume.experience.length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm font-bold text-gray-700 mb-3 tracking-wide">EXPERIENCE</p>
                          <div className="space-y-3">
                            {resume.experience.slice(0, 2).map((exp, idx) => (
                              <div key={idx}>
                                <p className="text-base font-semibold text-gray-800 line-clamp-1">
                                  {exp.title}
                                </p>
                                <p className="text-base text-gray-600 line-clamp-1">{exp.company}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education Preview */}
                      {resume.education && resume.education.length > 0 && resume.education[0].institution && (
                        <div className="mb-6">
                          <p className="text-sm font-bold text-gray-700 mb-3 tracking-wide">EDUCATION</p>
                          <p className="text-base font-semibold text-gray-800 line-clamp-1">
                            {resume.education[0].institution}
                          </p>
                          {resume.education[0].degree && (
                            <p className="text-base text-gray-600 line-clamp-1">
                              {resume.education[0].degree}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Skills Preview */}
                      {resume.skills && resume.skills.length > 0 && (
                        <div className="mt-auto">
                          <p className="text-sm font-bold text-gray-700 mb-3 tracking-wide">SKILLS</p>
                          <div className="flex flex-wrap gap-2">
                            {resume.skills.slice(0, 6).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-sm px-3 py-1.5 bg-gray-200 text-gray-700 rounded font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                      {resume.years_of_experience !== undefined && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {resume.years_of_experience}y
                        </Badge>
                      )}
                    </div>
                    {resume.company && (
                      <p className="text-sm text-muted-foreground mb-1">{resume.company}</p>
                    )}
                    {resume.education && resume.education.length > 0 && resume.education[0].institution && (
                      <p className="text-xs text-muted-foreground mb-3">{resume.education[0].institution}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {resume.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-md bg-secondary text-foreground"
                        >
                          {skill}
                        </span>
                      ))}
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
