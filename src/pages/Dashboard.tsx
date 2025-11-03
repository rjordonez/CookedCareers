import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Loader2, X, GitCompare } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useAuthReady } from "@/components/AuthProvider";
import { useResumeFilters } from "@/hooks/useResumeFilters";
import { useSearchResumesQuery } from "@/features/resumes/resumeService";
import { useGetSubscriptionStatusQuery, useCreateCheckoutSessionMutation } from "@/features/subscription/subscriptionService";
import { useCompareResumeMutation } from "@/features/user-resume/userResumeService";
import { ResumeDetailModal } from "@/components/ResumeDetailModal";
import { UpgradeButton } from "@/components/UpgradeButton";
import DashboardNav, { DashboardNavRef } from "@/components/DashboardNav";
import ComparisonModal from "@/components/ComparisonModal";
import UploadResumeModal from "@/components/UploadResumeModal";
import ComparisonLoadingModal from "@/components/ComparisonLoadingModal";
import ResumeCardSkeleton from "@/components/ResumeCardSkeleton";
import type { Resume } from "@/features/resumes/resumeTypes";
import { usePostHog } from "posthog-js/react";

const FREE_PREVIEW_COUNT = 6;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const { authReady } = useAuthReady();
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const posthog = usePostHog();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [compareResume] = useCompareResumeMutation();
  const [comparingResumeId, setComparingResumeId] = useState<string | null>(null);
  const [comparisonResume, setComparisonResume] = useState<Resume | null>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadModalMode, setUploadModalMode] = useState<'upload' | 'update'>('upload');
  const dashboardNavRef = useRef<DashboardNavRef>(null);

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
    refetchOnMountOrArgChange: 600, // Only refetch if data is older than 10 minutes
    keepUnusedDataFor: 600, // Keep cached data for 10 minutes
  });

  // Fetch subscription status (cached by RTK Query - refetch options set in baseApi)
  const { data: subscriptionData, isLoading: isLoadingSubscription, refetch: refetchSubscription } = useGetSubscriptionStatusQuery(undefined, {
    skip: !authReady || !isSignedIn,
  });
  const isPro = subscriptionData?.is_pro ?? false;
  const hasUploadedResume = !!subscriptionData?.user_resume_url;

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
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }
    setLocalSearchQuery("");
    clearFilters();
  };

  const handleSearchChange = (value: string) => {
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }
    setLocalSearchQuery(value);
  };

  const handleSeniorityChange = (value: string) => {
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }
    updateSeniority(value === "all" ? "" : value);
  };

  const handleSchoolChange = (value: string) => {
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }
    updateSchool(value === "all" ? "" : value);
  };

  const handleMyResumeClick = () => {
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }
    if (hasUploadedResume) {
      // Show update modal
      setUploadModalMode('update');
      setShowUploadModal(true);
    } else {
      // Directly trigger upload
      dashboardNavRef.current?.triggerUpload();
    }
  };

  const handleUploadComplete = () => {
    // Refetch subscription data to get updated user_resume_url
    refetchSubscription();
  };

  const handleExperienceChange = (value: string) => {
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }
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
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }
    updateCurrentPage(page);
  };

  const handleResumeClick = async (resume: Resume, index: number) => {
    // Check auth first
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }

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

  const handleCompareClick = async (e: React.MouseEvent, resume: Resume) => {
    e.stopPropagation(); // Prevent opening the modal

    // Check auth first
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }

    // Set this resume as currently comparing
    setComparingResumeId(resume.id);

    try {
      // Call the compare API endpoint
      const result = await compareResume({ resume_id: resume.id }).unwrap();

      // Set the resume and comparison data to open the modal
      setComparisonResume(resume);
      setComparisonData(result);
    } catch (error: any) {
      console.error("Comparison failed:", error);

      // Check if error is about missing resume
      const errorMessage = (error?.data?.detail || error?.message || "").toLowerCase();
      const isNoResumeError = errorMessage.includes("no resume") ||
                              errorMessage.includes("upload") ||
                              errorMessage.includes("not found") ||
                              error?.status === 404;

      if (isNoResumeError) {
        // Show upload modal instead of directly triggering upload
        setUploadModalMode('upload');
        setShowUploadModal(true);
      }
    } finally {
      // Clear comparing state
      setComparingResumeId(null);
    }
  };

  // Old mock data below - can be deleted
  const OLD_handleCompareClick = async (e: React.MouseEvent, resume: Resume) => {
    e.stopPropagation(); // Prevent opening the modal

    // Mock comparison data for now
    const mockComparisonData = {
      score: 78,
      ats_score: 65,
      compared_resume_ats_score: 92,
      feedback: {
        strengths: [
          "Your resume demonstrates excellent use of white space and clean formatting that makes it easy for recruiters to quickly scan and identify key information. The consistent font choices and clear section headers create a professional appearance that stands out in applicant tracking systems.",
          "Strong action verbs like 'developed', 'implemented', 'led', and 'optimized' throughout your experience section effectively communicate your contributions and impact. This active language helps paint a vivid picture of your accomplishments and demonstrates ownership of your work.",
          "Your technical skills section is well-organized and prominently displayed, making it immediately clear what technologies you're proficient in. The categorization of skills (e.g., languages, frameworks, tools) helps recruiters quickly assess your technical fit for the role.",
          "The chronological layout of your experience section flows logically and makes it easy to understand your career progression. Each role clearly states the company, position, and dates, which helps establish credibility and context.",
          "Your resume length is appropriate at one page, demonstrating your ability to communicate concisely and prioritize the most relevant information for the target role."
        ],
        weaknesses: [
          "Your accomplishments lack quantifiable metrics and specific numbers that demonstrate tangible impact. For example, instead of saying 'improved system performance', you should specify 'improved system performance by 40%, reducing load times from 3.2s to 1.9s and supporting 10,000+ concurrent users.' Numbers make your achievements concrete and memorable.",
          "The education section is sparse and missing valuable details like your GPA (if above 3.0), relevant coursework, academic projects, research experience, or honors/awards. These details are especially important for recent graduates or career changers and help establish your foundational knowledge in key areas.",
          "There's no professional summary or objective statement at the top of your resume to immediately communicate your value proposition and career goals. A well-crafted 2-3 sentence summary can hook the reader and provide context for everything that follows, especially when pivoting industries or targeting specific roles.",
          "Several bullet points are too vague and don't clearly articulate what you actually did or the business impact. Statements like 'worked on various projects' or 'helped the team' don't differentiate you from other candidates and miss opportunities to showcase your unique contributions.",
          "Your resume lacks keywords and terminology specific to the target industry or role, which could cause it to be filtered out by ATS systems. Research job descriptions for your target positions and incorporate relevant technical terms, methodologies, and industry-specific language throughout your resume."
        ],
        suggestions: [
          "Add specific metrics and numbers to every bullet point where possible. Examples: 'Reduced customer support tickets by 35% through automated FAQ system', 'Mentored 5 junior developers resulting in 2 promotions', 'Increased test coverage from 45% to 87% across 50+ microservices'. If exact numbers aren't available, use reasonable estimates or ranges to give readers a sense of scale and impact.",
          "Expand your education section to include: GPA (if 3.0+), Dean's List/honors, relevant coursework (especially courses directly related to your target role), significant academic projects with GitHub links, teaching assistant positions, research experience, or publications. For recent graduates, this section can be a major differentiator.",
          "Create a compelling professional summary at the top of your resume (2-3 sentences, 40-60 words) that includes: your current role/level, years of experience, key technical specializations, and your most impressive quantified achievement. Example: 'Full-stack software engineer with 4+ years building scalable web applications. Specialized in React, Node.js, and AWS cloud architecture. Led migration to microservices that reduced infrastructure costs by $120K annually while improving system reliability to 99.9% uptime.'",
          "Rewrite vague bullet points using the STAR method (Situation, Task, Action, Result). Each bullet should tell a mini-story: what challenge you faced, what you did about it, and what measurable outcome you achieved. Start with a strong action verb, include the technical approach, and end with quantified business impact.",
          "Optimize for ATS by incorporating keywords from the target job description. Review 5-10 job postings for your target role and identify recurring terms, technologies, and skills. Naturally weave these throughout your resume in context (don't just keyword stuff). Focus on: programming languages, frameworks, methodologies (Agile, CI/CD), tools, certifications, and industry-specific terminology.",
          "Consider adding a 'Projects' section if you have impressive side projects, open-source contributions, or personal work that demonstrates skills relevant to your target role. Include project name, technologies used, brief description, and link to live demo/GitHub. This is especially valuable for developers, designers, and technical roles.",
          "Review your experience bullets for parallel structure and consistency. All bullets should follow the same grammatical pattern (e.g., all starting with past-tense action verbs for previous roles, present-tense for current role). Ensure consistent punctuation, date formatting, and spacing throughout.",
          "Add any relevant certifications, publications, conference talks, or professional affiliations that demonstrate expertise and thought leadership in your field. These can be particularly impactful for technical roles, especially cloud certifications (AWS, Azure, GCP) or specialized training (machine learning, security, etc.)."
        ],
        critical_mistakes: [
          {
            original: "Responsible for managing social media accounts",
            suggested: "Grew Instagram following from 5K to 50K followers in 6 months, increasing engagement rate by 240% and driving $125K in attributed revenue through targeted content strategy"
          },
          {
            original: "Worked on improving the codebase",
            suggested: "Refactored legacy payment processing system, reducing code complexity by 45% and decreasing transaction failures from 8% to 0.3%, saving $2M annually in lost revenue"
          },
          {
            original: "Helped the sales team achieve their goals",
            suggested: "Implemented automated lead scoring system that increased sales team productivity by 35%, resulting in 200+ additional qualified demos per quarter and $4.2M in new pipeline"
          },
          {
            original: "Assisted with various marketing campaigns",
            suggested: "Launched and optimized 12 email marketing campaigns achieving 28% average open rate (vs. 18% industry standard), generating 1,500+ MQLs and $850K in attributed pipeline"
          }
        ]
      }
    };

    setComparisonResume(resume);
    setComparisonData(mockComparisonData);

    /* API call commented out for now
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user-resume/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ resume_id: resumeId }),
      });

      const data = await response.json();

      if (data.comparison) {
        setComparisonResume(resume);
        setComparisonData(data.comparison);
      } else {
        throw new Error(data.error || 'Comparison failed');
      }
    } catch (error: any) {
      console.error('Comparison failed:', error);
    }
    */
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        ref={dashboardNavRef}
        isPro={isPro}
        isLoadingSubscription={isLoadingSubscription}
        searchQuery={localSearchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search resumes by company... (ex. Google)"
        seniority={filters.seniority || "all"}
        onSeniorityChange={handleSeniorityChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        onMyResumeClick={handleMyResumeClick}
        hasUploadedResume={hasUploadedResume}
        onUploadSuccess={handleUploadComplete}
      />

      <main className="max-w-7xl mx-auto px-6 pt-4 pb-6">

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
                  <div className="aspect-[253/320] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative p-4 flex items-center justify-center">
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
                      {!isBlurred && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs font-semibold bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
                          onClick={(e) => handleCompareClick(e, resume)}
                          disabled={comparingResumeId !== null}
                        >
                          {comparingResumeId === resume.id ? 'Comparing...' : 'Compare'}
                        </Button>
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
      </main>

      <ResumeDetailModal
        resume={selectedResume}
        isOpen={selectedResume !== null}
        onClose={() => setSelectedResume(null)}
        isPremium={isPro}
      />

      <ComparisonModal
        isOpen={comparisonResume !== null}
        onClose={() => {
          setComparisonResume(null);
          setComparisonData(null);
        }}
        comparedResume={comparisonResume}
        comparisonData={comparisonData}
        isPro={isPro}
        userResumeUrl={subscriptionData?.user_resume_url}
      />

      <UploadResumeModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadClick={() => dashboardNavRef.current?.triggerUpload()}
        mode={uploadModalMode}
      />

      <ComparisonLoadingModal isOpen={comparingResumeId !== null} />
    </div>
  );
};

export default Dashboard;
