import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Loader2, X, GitCompare } from "lucide-react";
import { useAuthState, useRequireAuth, useResumeFilters } from "@/hooks";
import { useSearchResumesQuery } from "@/features/resumes/resumeService";
import { useCreateCheckoutSessionMutation } from "@/features/subscription/subscriptionService";
import { ResumeDetailModal } from "@/components/ResumeDetailModal";
import { UpgradeButton } from "@/components/UpgradeButton";
import DashboardLayout from "@/components/DashboardLayout";
import ResumeCardSkeleton from "@/components/ResumeCardSkeleton";
import type { Resume } from "@/features/resumes/resumeTypes";
import { usePostHog } from "posthog-js/react";

const FREE_PREVIEW_COUNT = 6;

const Resumes = () => {
  const { user, querySkipCondition, isPro, isLoadingSubscription } = useAuthState();
  const { requireAuth } = useRequireAuth();
  const navigate = useNavigate();
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const posthog = usePostHog();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

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
    skip: querySkipCondition,
    refetchOnMountOrArgChange: 600, // Only refetch if data is older than 10 minutes
    keepUnusedDataFor: 600, // Keep cached data for 10 minutes
  });

  const sortedResumes = data?.results || [];

  // Detect if we're waiting for new data (page change, filter change, or search)
  const isPageChanging = data ? filters.currentPage !== data.pagination.page : false;

  // Normalize values for comparison (treat null, undefined, and empty string as equivalent)
  const normalizeValue = (val: string | number | null | undefined) => val || null;

  const isFilterChanging = data ? (
    normalizeValue(filters.searchQuery) !== normalizeValue(data.filters_applied.query) ||
    normalizeValue(filters.seniority) !== normalizeValue(data.filters_applied.seniority) ||
    normalizeValue(filters.school) !== normalizeValue(data.filters_applied.school) ||
    normalizeValue(filters.minExperience) !== normalizeValue(data.filters_applied.min_experience) ||
    normalizeValue(filters.maxExperience) !== normalizeValue(data.filters_applied.max_experience)
  ) : false;
  const showSkeletons = isLoading || isPageChanging || isFilterChanging;

  // Sync local search with URL params on mount
  useEffect(() => {
    setLocalSearchQuery(filters.searchQuery);
  }, [filters.searchQuery]);

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
    if (!requireAuth()) return;
    setLocalSearchQuery("");
    clearFilters();
  };

  const handleSearchChange = (value: string) => {
    if (!requireAuth()) return;
    setLocalSearchQuery(value);
  };

  const handleSeniorityChange = (value: string) => {
    if (!requireAuth()) return;
    updateSeniority(value === "all" ? "" : value);
  };

  const handleSchoolChange = (value: string) => {
    if (!requireAuth()) return;
    updateSchool(value === "all" ? "" : value);
  };

  const handleExperienceChange = (value: string) => {
    if (!requireAuth()) return;
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

  const handlePageChange = (page: number) => {
    if (!requireAuth()) return;
    updateCurrentPage(page);
  };

  const handleResumeClick = async (resume: Resume, index: number) => {
    if (!requireAuth()) return;

    const globalIndex = (filters.currentPage - 1) * 18 + index;
    const hasSearch = filters.searchQuery.trim().length > 0;
    const canView = isPro || (!hasSearch && globalIndex < FREE_PREVIEW_COUNT);

    if (canView) {
      setSelectedResume(resume);
    } else {
      // Redirect to Stripe checkout
      try {
        const result = await createCheckoutSession().unwrap();
        window.location.href = result.checkout_url;
      } catch (error: any) {
        console.error("Failed to create checkout session:", error);
      }
    }
  };

  return (
    <DashboardLayout isPro={isPro} isLoadingSubscription={isLoadingSubscription}>
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-6">
        {/* Search and Filters Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search resumes by company... (ex. Google)"
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full h-12 pl-4 pr-4 rounded-full bg-muted border-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Select value={filters.seniority || "all"} onValueChange={handleSeniorityChange}>
              <SelectTrigger className="w-[140px] h-12 rounded-full">
                <SelectValue placeholder="Seniority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seniority</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2 px-2 py-1.5 bg-muted rounded-full h-12 shrink-0">
              <button
                onClick={() => {}}
                className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-colors"
              >
                Resumes
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-background"
              >
                Projects
              </button>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                size="icon"
                className="w-12 h-12 rounded-full shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {isError && (
          <Card className="p-8 text-center">
            <p className="text-destructive mb-2">Failed to load resumes</p>
            <p className="text-sm text-muted-foreground">
              {error && 'status' in error ? `Error: ${error.status}` : 'Please check your connection and try again'}
            </p>
          </Card>
        )}

        {!showSkeletons && !isError && data && data.results.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No resumes found matching your criteria</p>
          </Card>
        )}

        {!isError && (showSkeletons || (data && sortedResumes.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {showSkeletons ? (
              // Show skeleton cards while loading or page is changing
              Array.from({ length: 18 }).map((_, index) => (
                <ResumeCardSkeleton key={`skeleton-${index}`} />
              ))
            ) : (
              sortedResumes.slice(0, 18).map((resume, index) => {
              const globalIndex = (filters.currentPage - 1) * 18 + index;
              const hasSearch = filters.searchQuery.trim().length > 0;
              const isBlurred = !isPro && (hasSearch || globalIndex >= FREE_PREVIEW_COUNT);
              return (
              <div key={resume.id} className="relative h-full group">
                <Card
                  className="overflow-hidden border-0 bg-muted rounded-2xl hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full"
                  onClick={() => handleResumeClick(resume, index)}
                >
                  <div className="aspect-[253/320] bg-white overflow-hidden relative flex items-center justify-center">
                    {resume.file_url && resume.file_url.toLowerCase().endsWith('.pdf') ? (
                      <div className={`w-full h-full bg-white overflow-hidden relative ${isBlurred ? 'blur-md' : ''}`}>
                        <object
                          data={`${resume.file_url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                          type="application/pdf"
                          className="w-full h-full pointer-events-none"
                        >
                          <embed
                            src={`${resume.file_url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                            type="application/pdf"
                            className="w-full h-full pointer-events-none"
                          />
                        </object>
                      </div>
                    ) : (
                      <div className={`w-full h-full bg-white flex items-center justify-center ${isBlurred ? 'blur-md' : ''}`}>
                        <p className="text-muted-foreground">No preview available</p>
                      </div>
                    )}
                    {isBlurred && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center p-4">
                          <Crown className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <p className="text-sm font-semibold mb-1">Pro Only</p>
                          <p className="text-xs text-muted-foreground">Click to upgrade</p>
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
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <div className="flex flex-wrap gap-2 items-center">
                        {(() => {
                          const companyLogos: Record<string, string> = {
                            'Google': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png',
                            'Meta': 'https://brandlogos.net/wp-content/uploads/2021/10/meta-logo-512x512.png',
                            'Amazon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2880px-Amazon_logo.svg.png',
                            'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png',
                            'Apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png',
                            'Netflix': 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg',
                            'NVIDIA': 'https://upload.wikimedia.org/wikipedia/sco/thumb/2/21/Nvidia_logo.svg/1200px-Nvidia_logo.svg.png',
                            'Jane Street': 'https://avatars.githubusercontent.com/u/3384712?s=280&v=4',
                            'Citadel': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU0UCFsdvrDlX5MzjSH7Uy5LtBj3BXlFtWPrbbq0F9WtOLGFDtq-p8Ef1UOsKbR9a8jGE&usqp=CAU',
                            'Tesla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png',
                            'Deloitte': 'https://pbs.twimg.com/profile_images/743077244218707968/fQE6lnor_400x400.jpg',
                            'Sentry': 'https://cdn.worldvectorlogo.com/logos/sentry-3.svg',
                            'Shopify': 'https://cdn-icons-png.freepik.com/512/2496/2496101.png',
                          };

                          // Get all matching companies from experience array
                          const experienceCompanies = resume.experience?.map(exp => exp.company?.toUpperCase()) || [];
                          const companiesWithLogos = Object.keys(companyLogos).filter(company =>
                            experienceCompanies.some(expCompany => expCompany?.includes(company.toUpperCase()))
                          );

                          return companiesWithLogos.length > 0 ? (
                            companiesWithLogos.map(company => (
                              <img key={company} src={companyLogos[company]} alt={company} className="h-6 object-contain" />
                            ))
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
                  </div>
                </Card>
              </div>
              );
            })
            )}
          </div>
        )}

        {!isError && ((data && sortedResumes.length >= 18) || showSkeletons) && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.max(1, filters.currentPage - 1))}
              disabled={filters.currentPage === 1 || showSkeletons}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {filters.currentPage} of 100+
            </span>
            <Button
              variant="outline"
              onClick={() => {
                // If we're at or past page 100, loop back to page 1
                const nextPage = filters.currentPage >= 100 ? 1 : filters.currentPage + 1;
                handlePageChange(nextPage);
              }}
              disabled={showSkeletons}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <ResumeDetailModal
        resume={selectedResume}
        isOpen={selectedResume !== null}
        onClose={() => setSelectedResume(null)}
        isPremium={isPro}
      />
    </DashboardLayout>
  );
};

export default Resumes;
