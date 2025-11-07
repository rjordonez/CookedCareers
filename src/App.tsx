import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Resumes from "./pages/Resumes";
import ResumeBuilder from "./pages/ResumeBuilder";
import ProjectsDashboard from "./pages/ProjectsDashboard";
import AnonymizerDashboard from "./pages/AnonymizerDashboard";
import ResumeReviewRequest from "./pages/ResumeReviewRequest";
import ResumeReviewDashboard from "./pages/ResumeReviewDashboard";
import ResumeReviewDetail from "./pages/ResumeReviewDetail";
import DevReviewPanel from "./pages/DevReviewPanel";
import DevReviewDetailPanel from "./pages/DevReviewDetailPanel";
import ShareView from "./pages/ShareView";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import Account from "./pages/Account";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { pdfjs } from 'react-pdf';

// Configure PDF.js worker globally
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/*" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resumes" element={<Resumes />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/projects" element={<ProjectsDashboard />} />
            <Route path="/anonymizer" element={<AnonymizerDashboard />} />
            <Route path="/resume-review" element={<ResumeReviewRequest />} />
            <Route path="/resume-review/dashboard" element={<ResumeReviewDashboard />} />
            <Route path="/resume-review/:id" element={<ResumeReviewDetail />} />
            <Route path="/dev-review" element={<DevReviewPanel />} />
            <Route path="/dev-review/:id" element={<DevReviewDetailPanel />} />
            <Route path="/share/:token" element={<ShareView />} />
            <Route path="/subscription/success" element={<SubscriptionSuccess />} />
            <Route path="/account" element={<Account />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
