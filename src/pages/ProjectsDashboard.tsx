import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Code, Loader2, ExternalLink } from "lucide-react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useAuthReady } from "@/components/AuthProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCurrentPage,
  selectProjectParams,
} from "@/features/projects/projectSlice";
import { useGetProjectsQuery } from "@/features/projects/projectService";
import { useGetSubscriptionStatusQuery } from "@/features/subscription/subscriptionService";

const FREE_PREVIEW_COUNT = 3;

const ProjectsDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const { authReady } = useAuthReady();
  const dispatch = useAppDispatch();

  // Get pagination from Redux state
  const pagination = useAppSelector((state) => state.projectPagination);
  const projectParams = useAppSelector(selectProjectParams);

  // Fetch projects from API
  const { data, isLoading, isError, error } = useGetProjectsQuery(projectParams, {
    skip: !authReady || !isSignedIn,
    refetchOnMountOrArgChange: 60, // Only refetch if data is older than 60s
  });

  // Fetch subscription status (shared across app via RTK Query cache)
  const { data: subscriptionData } = useGetSubscriptionStatusQuery(undefined, {
    skip: !authReady || !isSignedIn,
  });
  const isPremium = subscriptionData?.is_pro || false;

  useEffect(() => {
    if (isLoaded && !user) {
      navigate("/auth");
    }
  }, [isLoaded, user, navigate]);

  const handleUpgrade = async () => {
    // TODO: Implement upgrade logic with Clerk metadata
    console.log("Upgrade to premium");
  };

  const isBlurred = (index: number) => {
    const globalIndex = (pagination.currentPage - 1) * pagination.itemsPerPage + index;
    return !isPremium && globalIndex >= FREE_PREVIEW_COUNT;
  };

  if (!isLoaded || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Code className="w-6 h-6" />
              Project Library
            </h1>
            <nav className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                Resumes
              </Button>
              <Button variant="default" size="sm">
                Projects
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </span>
            {isPremium && (
              <Badge variant="default" className="gap-1">
                <Crown className="w-3 h-3" />
                Pro
              </Badge>
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
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-4 pb-6">
        {!isPremium && data && (
          <Card className="mb-8 p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Unlock Full Access</h3>
                <p className="text-sm text-muted-foreground">
                  You're viewing {FREE_PREVIEW_COUNT} of {data.pagination.total} projects. Upgrade to see them all for just $4.99/month.
                </p>
              </div>
              <Button size="lg" className="gap-2" onClick={handleUpgrade}>
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </Button>
            </div>
          </Card>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading projects...</span>
          </div>
        )}

        {isError && (
          <Card className="p-8 text-center">
            <p className="text-destructive mb-2">Failed to load projects</p>
            <p className="text-sm text-muted-foreground">
              {error && 'status' in error ? `Error: ${error.status}` : 'Please check your connection and try again'}
            </p>
          </Card>
        )}

        {!isLoading && !isError && data && data.projects.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No projects found</p>
          </Card>
        )}

        {!isLoading && !isError && data && data.projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {data.projects.map((project, index) => {
              const isProjectBlurred = isBlurred(index);
              return (
              <div key={`${project.owner_id}-${index}`} className="relative">
                <Card
                  className="group overflow-hidden border border-border hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-card"
                  onClick={() => !isProjectBlurred && project.project_url && window.open(project.project_url, '_blank')}
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
                          href={project.project_url}
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
            })}
          </div>
        )}

        {!isLoading && !isError && data && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => dispatch(setCurrentPage(Math.max(1, pagination.currentPage - 1)))}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {data.pagination.page} of {data.pagination.total_pages}
            </span>
            <Button
              variant="outline"
              onClick={() => dispatch(setCurrentPage(Math.min(data.pagination.total_pages, pagination.currentPage + 1)))}
              disabled={pagination.currentPage === data.pagination.total_pages}
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectsDashboard;
