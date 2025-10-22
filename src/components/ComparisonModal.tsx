import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Resume } from "@/features/resumes/resumeTypes";

interface ComparisonData {
  score: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    critical_mistakes: { original: string; suggested: string }[];
  };
  ats_score: number;
  compared_resume_ats_score: number;
}

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedResume: Resume | null;
  comparisonData: ComparisonData | null;
}

const ComparisonModal = ({ isOpen, onClose, comparedResume, comparisonData }: ComparisonModalProps) => {
  if (!comparedResume || !comparisonData) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-background p-0 gap-0">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">Resume Analysis</h2>
            <p className="text-sm text-muted-foreground mt-1">See how your resume compares</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Your Resume */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold mb-3">Your Resume</h3>
                <div className="overflow-hidden rounded-2xl border-0 bg-muted shadow-lg">
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Your resume preview</p>
                  </div>
                </div>
                <div className="mt-3 p-4 bg-muted rounded-xl text-center">
                  <p className="text-xs text-muted-foreground mb-1">ATS Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(comparisonData.ats_score)}`}>
                    {comparisonData.ats_score}%
                  </p>
                </div>
              </div>
            </div>

            {/* Middle - Compared Resume */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold mb-3">Compared Resume</h3>
                <div className="overflow-hidden rounded-2xl border-0 bg-muted shadow-lg">
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative p-4 flex items-center justify-center">
                    {comparedResume.file_url && comparedResume.file_url.toLowerCase().endsWith('.pdf') ? (
                      <div className="w-full h-full bg-white overflow-hidden relative">
                        <object
                          data={`${comparedResume.file_url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                          type="application/pdf"
                          className="w-full h-full pointer-events-none"
                        >
                          <embed
                            src={`${comparedResume.file_url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                            type="application/pdf"
                            className="w-full h-full pointer-events-none"
                          />
                        </object>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-white flex items-center justify-center">
                        <p className="text-muted-foreground">No preview available</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 p-4 bg-muted rounded-xl text-center">
                  <p className="text-xs text-muted-foreground mb-1">ATS Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(comparisonData.compared_resume_ats_score)}`}>
                    {comparisonData.compared_resume_ats_score}%
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Feedback */}
            <div className="space-y-4">
              {/* Overall Score */}
              <div className="p-6 bg-[#1a1a1a] text-white rounded-2xl text-center">
                <p className="text-xs text-gray-400 mb-2">Match Score</p>
                <p className="text-5xl font-bold">
                  {comparisonData.score}%
                </p>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="text-sm font-semibold mb-2">✓ Strengths</h3>
                <div className="space-y-2">
                  {comparisonData.feedback.strengths.slice(0, 3).map((strength, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-xl border-0">
                      <p className="text-xs leading-relaxed">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h3 className="text-sm font-semibold mb-2">✗ Areas to Improve</h3>
                <div className="space-y-2">
                  {comparisonData.feedback.weaknesses.slice(0, 3).map((weakness, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-xl border-0">
                      <p className="text-xs leading-relaxed">{weakness}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <h3 className="text-sm font-semibold mb-2">→ Key Suggestions</h3>
                <div className="space-y-2">
                  {comparisonData.feedback.suggestions.slice(0, 3).map((suggestion, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-xl border-0">
                      <p className="text-xs leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Mistakes */}
              <div>
                <h3 className="text-sm font-semibold mb-2">⚠ Critical Mistakes</h3>
                <div className="space-y-2">
                  {comparisonData.feedback.critical_mistakes.map((mistake, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-xl border-0">
                      <div className="space-y-2">
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground mb-1">INSTEAD OF:</p>
                          <p className="text-xs leading-relaxed opacity-60">{mistake.original}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground mb-1">WRITE THIS:</p>
                          <p className="text-xs leading-relaxed font-medium">{mistake.suggested}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonModal;
