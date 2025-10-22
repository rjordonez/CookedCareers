import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, GitCompare } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ComparisonLoadingModalProps {
  isOpen: boolean;
}

const ComparisonLoadingModal = ({ isOpen }: ComparisonLoadingModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Analyzing Resume</DialogTitle>
          <DialogDescription>
            Please wait while we analyze and compare your resume
          </DialogDescription>
        </VisuallyHidden>

        <div className="text-center py-8 px-4">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 relative">
            <GitCompare className="w-10 h-10 text-muted-foreground" />
            <Loader2 className="w-20 h-20 animate-spin text-primary absolute" />
          </div>

          <h2 className="text-2xl font-bold mb-3">Analyzing Your Resume</h2>

          <p className="text-muted-foreground mb-4">
            Our AI is comparing your resume and generating personalized feedback...
          </p>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Analyzing content structure</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
              <span>Calculating ATS compatibility</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
              <span>Generating improvement suggestions</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonLoadingModal;
