import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Resume } from "@/features/resumes/resumeTypes";
import type { CompareResumeResponse } from "@/features/user-resume/userResumeService";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedResume: Resume | null;
  comparisonData: CompareResumeResponse | null;
  isPro: boolean;
  userResumeUrl?: string | null;
}

const ComparisonModal = ({ isOpen, onClose, comparedResume, comparisonData, isPro, userResumeUrl }: ComparisonModalProps) => {
  if (!comparedResume || !comparisonData) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-hidden bg-background p-0 gap-0">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-bold">Resume Analysis</h2>
          <p className="text-xs text-muted-foreground mt-0.5">See how your resume compares</p>
        </div>

        <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: 'calc(95vh - 80px)' }}>
          {/* Score Section */}
          <div className="mb-6">
            <div className="inline-block px-6 py-4 bg-[#1a1a1a] text-white rounded-2xl">
              <p className="text-xs text-gray-300 mb-1">Overall Match</p>
              <p className="text-4xl font-bold text-white">{comparisonData.overall_match_score}%</p>
            </div>
          </div>

          {/* Resume Previews Side by Side */}
          <div className="flex items-start gap-6 mb-8">
            {/* Your Resume */}
            <div className="flex flex-col items-center">
              <div className="w-32 flex-shrink-0 mb-3">
                <div className="overflow-hidden rounded-xl bg-muted shadow-lg">
                  <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative flex items-center justify-center p-2">
                    {userResumeUrl && userResumeUrl.toLowerCase().endsWith('.pdf') ? (
                      <div className="w-full h-full bg-white overflow-hidden relative">
                        <object
                          data={`${userResumeUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                          type="application/pdf"
                          className="w-full h-full pointer-events-none"
                        >
                          <embed
                            src={`${userResumeUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                            type="application/pdf"
                            className="w-full h-full pointer-events-none"
                          />
                        </object>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs">Your resume</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold mb-2">Your Resume</h3>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground">ATS</p>
                    <p className={`text-2xl font-bold leading-none ${getScoreColor(comparisonData.user_resume_ats_score)}`}>
                      {comparisonData.user_resume_ats_score}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compared Resume */}
            <div className="flex flex-col items-center">
              <div className="w-32 flex-shrink-0 mb-3">
                <div className="overflow-hidden rounded-xl bg-muted shadow-lg">
                  <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative flex items-center justify-center p-2">
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
                        <p className="text-muted-foreground text-[10px]">No preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold mb-2">{comparisonData.db_resume_name}</h3>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground">ATS</p>
                    <p className={`text-2xl font-bold leading-none ${getScoreColor(comparisonData.db_resume_ats_score)}`}>
                      {comparisonData.db_resume_ats_score}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Sections - Full Width Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Critical Mistakes */}
            <div className="relative">
              <h3 className="text-sm font-semibold mb-3">⚠ What You Should Write Instead</h3>
              <div className="space-y-3">
                {comparisonData.what_to_write_instead.map((mistake, idx) => (
                  <div key={idx} className={`p-4 bg-muted rounded-xl ${!isPro && idx >= 1 ? "blur-sm select-none" : ""}`}>
                    <div className="space-y-2.5">
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">INSTEAD OF:</p>
                        <p className={`text-xs leading-relaxed opacity-60 ${!isPro && idx >= 1 ? "select-none" : ""}`}>
                          {mistake.original}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">WRITE THIS:</p>
                        <p className={`text-xs leading-relaxed font-medium ${!isPro && idx >= 1 ? "select-none" : ""}`}>
                          {mistake.improved}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overlay for this section */}
              {!isPro && (
                <div className="absolute top-[140px] left-0 right-0 bottom-0 z-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80"></div>
                  <div className="relative z-20 text-center p-8">
                    <h3 className="text-2xl font-bold mb-3">Unlock Pro to Get Unlimited Compares</h3>
                    <p className="text-muted-foreground mb-6">
                      Get detailed feedback on what you should write instead, what's working, what needs work, and actionable next steps.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-[#1a1a1a] text-white rounded-full font-semibold hover:bg-[#2a2a2a] transition-colors"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Strengths & Weaknesses Combined */}
            <div className="space-y-6 relative">
              {/* Strengths */}
              <div>
                <h3 className="text-sm font-semibold mb-3">✓ What's Working</h3>
                <div className="space-y-2">
                  {comparisonData.whats_working.slice(0, 2).map((strength, idx) => (
                    <div key={idx} className={`p-3 bg-muted rounded-xl ${!isPro && idx >= 1 ? "blur-sm select-none" : ""}`}>
                      <p className={`text-xs leading-relaxed ${!isPro && idx >= 1 ? "select-none" : ""}`}>
                        {strength}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h3 className="text-sm font-semibold mb-3">✗ What Needs Work</h3>
                <div className="space-y-2">
                  {comparisonData.what_needs_work.slice(0, 2).map((weakness, idx) => (
                    <div key={idx} className={`p-3 bg-muted rounded-xl ${!isPro ? "blur-sm select-none" : ""}`}>
                      <p className={`text-xs leading-relaxed ${!isPro ? "select-none" : ""}`}>
                        {weakness}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Suggestions */}
              <div>
                <h3 className="text-sm font-semibold mb-3">→ Next Steps</h3>
                <div className="space-y-2">
                  {comparisonData.next_steps.slice(0, 2).map((suggestion, idx) => (
                    <div key={idx} className={`p-3 bg-muted rounded-xl ${!isPro ? "blur-sm select-none" : ""}`}>
                      <p className={`text-xs leading-relaxed ${!isPro ? "select-none" : ""}`}>
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overlay for this section */}
              {!isPro && (
                <div className="absolute top-[120px] left-0 right-0 bottom-0 z-10 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonModal;
