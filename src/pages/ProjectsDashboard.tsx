import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Loader2, ExternalLink, X } from "lucide-react";
import { useAuthState, useRequireAuth, useProjectFilters } from "@/hooks";
import { useGetProjectsQuery } from "@/features/projects/projectService";
import { useCreateCheckoutSessionMutation } from "@/features/subscription/subscriptionService";
import DashboardLayout from "@/components/DashboardLayout";
import { UpgradeButton } from "@/components/UpgradeButton";
import ProjectCardSkeleton from "@/components/ProjectCardSkeleton";

const FREE_PREVIEW_COUNT = 3;

// Helper function to ensure URL has protocol
const ensureHttps = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

const ProjectsDashboard = () => {
  const { querySkipCondition, isPro, isLoadingSubscription } = useAuthState();
  const { requireAuth } = useRequireAuth();
  const navigate = useNavigate();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [localTechnologies, setLocalTechnologies] = useState("");

  // Get filters from URL search params
  const {
    filters,
    apiParams,
    setSearchQuery: updateSearchQuery,
    setTechnologies: updateTechnologies,
    setCurrentPage: updateCurrentPage,
    resetFilters: clearFilters,
    hasActiveFilters,
  } = useProjectFilters();

  // Fetch projects from API
  const { data, isLoading, isFetching, isError, error } = useGetProjectsQuery(apiParams, {
    skip: querySkipCondition,
    refetchOnMountOrArgChange: 600,
    keepUnusedDataFor: 600,
  });

  // Detect if we're waiting for new data
  const isPageChanging = data ? filters.currentPage !== data.pagination.page : false;
  const showSkeletons = isLoading || isFetching || isPageChanging;

  // Sync local state with URL params on mount
  useEffect(() => {
    setLocalSearchQuery(filters.searchQuery);
    setLocalTechnologies(filters.technologies);
  }, [filters.searchQuery, filters.technologies]);

  // Debounce search query
  useEffect(() => {
    if (localSearchQuery === filters.searchQuery) return;

    const timer = setTimeout(() => {
      updateSearchQuery(localSearchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, filters.searchQuery, updateSearchQuery]);

  // Debounce technologies
  useEffect(() => {
    if (localTechnologies === filters.technologies) return;

    const timer = setTimeout(() => {
      updateTechnologies(localTechnologies);
    }, 500);

    return () => clearTimeout(timer);
  }, [localTechnologies, filters.technologies, updateTechnologies]);

  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const isBlurred = (index: number) => {
    const globalIndex = (filters.currentPage - 1) * 12 + index;
    return !isPro && globalIndex >= FREE_PREVIEW_COUNT;
  };

  const handleProjectClick = async (projectUrl: string | undefined, isProjectBlurred: boolean) => {
    if (!requireAuth()) return;

    if (isProjectBlurred && !isPro) {
      // Redirect to Stripe checkout
      try {
        const result = await createCheckoutSession().unwrap();
        window.location.href = result.checkout_url;
      } catch (error: any) {
        console.error("Failed to create checkout session:", error);
      }
    } else if (!isProjectBlurred && projectUrl) {
      window.open(ensureHttps(projectUrl), '_blank');
    }
  };

  const handleClearFilters = () => {
    if (!requireAuth()) return;
    setLocalSearchQuery("");
    setLocalTechnologies("");
    clearFilters();
  };

  const handleSearchChange = (value: string) => {
    if (!requireAuth()) return;
    setLocalSearchQuery(value);
  };

  const handleTechnologiesChange = (value: string) => {
    if (!requireAuth()) return;
    setLocalTechnologies(value);
  };

  const handlePageChange = (page: number) => {
    if (!requireAuth()) return;
    updateCurrentPage(page);
  };

  return (
    <DashboardLayout isPro={isPro} isLoadingSubscription={isLoadingSubscription}>
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-6">
        {/* Search and Filters Bar */}
        <div className="mb-6 space-y-3">
          {/* Toggle Switch - Mobile Top */}
          <div className="flex items-center justify-center md:hidden">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-muted rounded-full h-12">
              <button
                onClick={() => navigate('/resumes')}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-background"
              >
                Resumes
              </button>
              <button
                onClick={() => {}}
                className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-colors"
              >
                Projects
              </button>
            </div>
          </div>

          {/* Search and Filters Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search projects... (ex. recommendation system)"
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full h-12 pl-4 pr-4 rounded-full bg-muted border-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Technologies... (ex. python,react,docker)"
                value={localTechnologies}
                onChange={(e) => handleTechnologiesChange(e.target.value)}
                className="w-full h-12 pl-4 pr-4 rounded-full bg-muted border-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Toggle Switch - Desktop */}
            <div className="hidden md:flex items-center gap-2 px-2 py-1.5 bg-muted rounded-full h-12 shrink-0">
              <button
                onClick={() => navigate('/resumes')}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-background"
              >
                Resumes
              </button>
              <button
                onClick={() => {}}
                className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-colors"
              >
                Projects
              </button>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                size="icon"
                className="w-full md:w-12 h-12 rounded-full shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        {isError && (
          <Card className="p-8 text-center">
            <p className="text-destructive mb-2">Failed to load projects</p>
            <p className="text-sm text-muted-foreground">
              {error && 'status' in error ? `Error: ${error.status}` : 'Please check your connection and try again'}
            </p>
          </Card>
        )}

        {!showSkeletons && !isError && data && data.projects.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No projects found</p>
          </Card>
        )}

        {!isError && (showSkeletons || (data && data.projects.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {showSkeletons ? (
              // Show skeleton cards while loading or page is changing
              Array.from({ length: 12 }).map((_, index) => (
                <ProjectCardSkeleton key={`skeleton-${index}`} />
              ))
            ) : (
              data!.projects.map((project, index) => {
              const isProjectBlurred = isBlurred(index);
              const hasUrl = !!project.project_url;
              const isClickable = !isProjectBlurred && hasUrl;
              return (
              <div key={`${project.owner_id}-${index}`} className="relative">
                <Card
                  className={`group overflow-hidden border border-border transition-all duration-300 bg-card ${
                    isClickable
                      ? 'cursor-pointer hover:shadow-xl hover:scale-105 hover:-translate-y-2'
                      : 'cursor-default opacity-75'
                  }`}
                  onClick={() => handleProjectClick(project.project_url, isProjectBlurred)}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-white to-gray-50 overflow-hidden relative border-b">
                    <div className={`w-full h-full p-6 flex flex-col ${
                      isProjectBlurred ? 'blur-md' : ''
                    }`}>
                      {/* Header */}
                      <div className="mb-4 pb-3 border-b-2 border-gray-200">
                        <h4 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                          {project.project_name}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-1">{project.owner_name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{project.owner_title}</p>
                      </div>

                      {/* Description */}
                      <div className="mb-4 flex-1">
                        <p className="text-xs font-bold text-gray-700 mb-2 tracking-wide">DESCRIPTION</p>
                        <p className="text-sm text-gray-700 line-clamp-4">
                          {project.project_description}
                        </p>
                      </div>

                      {/* Technologies */}
                      {project.project_technologies && project.project_technologies.length > 0 && (
                        <div className="mt-auto">
                          <p className="text-xs font-bold text-gray-700 mb-2 tracking-wide">TECHNOLOGIES</p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.project_technologies.slice(0, 6).map((tech, techIdx) => (
                              <span
                                key={techIdx}
                                className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {isProjectBlurred && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center p-4">
                          <Crown className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <p className="text-sm font-semibold mb-1">Pro Only</p>
                          <p className="text-xs text-muted-foreground">Upgrade to view</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.owner_email}</p>
                      {project.project_url && (
                        <a
                          href={ensureHttps(project.project_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
              );
            })
            )}
          </div>
        )}

        {!isError && ((data && data.projects.length >= 12) || showSkeletons) && (
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
    </DashboardLayout>
  );
};

export default ProjectsDashboard;
