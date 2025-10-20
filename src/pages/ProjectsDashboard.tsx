import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAuth } from "@/lib/mockAuth";
import { mockProjects, Project } from "@/lib/mockProjectData";
import { Search, LogOut, Crown, Code } from "lucide-react";

const ITEMS_PER_PAGE = 20;
const FREE_PREVIEW_COUNT = 3;

const ProjectsDashboard = () => {
  const navigate = useNavigate();
  const user = mockAuth.getSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [complexityFilter, setComplexityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const companies = useMemo(() => 
    ["all", ...new Set(mockProjects.map(p => p.company))].sort(),
    []
  );
  
  const types = useMemo(() => 
    ["all", ...new Set(mockProjects.map(p => p.type))].sort(),
    []
  );

  const filteredProjects = useMemo(() => {
    return mockProjects.filter(project => {
      const matchesSearch = searchQuery === "" || 
        project.keywords.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCompany = companyFilter === "all" || project.company === companyFilter;
      const matchesType = typeFilter === "all" || project.type === typeFilter;
      const matchesComplexity = complexityFilter === "all" || project.complexity === complexityFilter;
      
      return matchesSearch && matchesCompany && matchesType && matchesComplexity;
    });
  }, [searchQuery, companyFilter, typeFilter, complexityFilter]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleLogout = () => {
    mockAuth.signOut();
    navigate("/");
  };

  const isBlurred = (index: number) => {
    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    return !user?.isPremium && globalIndex >= FREE_PREVIEW_COUNT;
  };

  if (!user) return null;

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
            <span className="text-sm text-muted-foreground">{user.email}</span>
            {user.isPremium && (
              <Badge variant="default" className="gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-4 pb-6">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company} value={company}>
                    {company === "all" ? "All Companies" : company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={complexityFilter} onValueChange={setComplexityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!user.isPremium && (
          <Card className="mb-8 p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Unlock Full Access</h3>
                <p className="text-sm text-muted-foreground">
                  You're viewing {FREE_PREVIEW_COUNT} of {filteredProjects.length} projects. Upgrade to see them all.
                </p>
              </div>
              <Button size="lg" className="gap-2">
                <Crown className="w-4 h-4" />
                Upgrade to Premium
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {paginatedProjects.map((project, index) => (
            <div key={project.id} className="relative">
              <Card className="group overflow-hidden border border-border hover:shadow-lg transition-all duration-300 cursor-pointer bg-card">
                <div className="aspect-[3/4] bg-muted overflow-hidden relative">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                      isBlurred(index) ? 'blur-md' : ''
                    }`}
                  />
                  {isBlurred(index) && (
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
                    <h3 className="font-semibold text-sm leading-tight">{project.title}</h3>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {project.complexity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{project.company}</p>
                  <p className="text-xs text-muted-foreground mb-3">{project.type}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-md bg-secondary text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProjectsDashboard;
