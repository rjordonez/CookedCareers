import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle, TrendingUp, FileSearch, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAnalyzeResumeMutation } from '@/features/ats/atsService';
import type { ATSSuggestion } from '@/features/ats/atsTypes';

export interface ATSData {
  jobDescription: string;
  score: number;
  suggestions: ATSSuggestion[];
}

interface ATSCheckerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  resumeId: string | null;
  initialData?: ATSData | null;
}

export default function ATSCheckerSidebar({ isOpen, onClose, resumeId, initialData }: ATSCheckerSidebarProps) {
  const [jobDescription, setJobDescription] = useState(initialData?.jobDescription || '');
  const [hasAnalyzed, setHasAnalyzed] = useState(!!initialData);
  const [atsScore, setAtsScore] = useState(initialData?.score || 0);
  const [suggestions, setSuggestions] = useState<ATSSuggestion[]>(initialData?.suggestions || []);

  // Update state when initialData changes
  useEffect(() => {
    if (initialData) {
      setJobDescription(initialData.jobDescription);
      setAtsScore(initialData.score);
      setSuggestions(initialData.suggestions);
      setHasAnalyzed(true);
    }
  }, [initialData]);

  const [analyzeResume, { isLoading: isAnalyzing }] = useAnalyzeResumeMutation();

  const handleAnalyze = async () => {
    if (!resumeId || !jobDescription.trim()) return;

    const formData = new FormData();
    formData.append('existing_resume_id', resumeId);
    formData.append('job_description', jobDescription);

    try {
      const result = await analyzeResume(formData).unwrap();

      if (result.success) {
        setAtsScore(result.score);
        setSuggestions(result.suggestions);
        setHasAnalyzed(true);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div
      className={`fixed top-0 md:top-[52px] right-0 h-full md:h-[calc(100vh-52px)] w-80 bg-background border-l shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5" />
            <h2 className="font-semibold">ATS Checker</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Check how well your resume matches the job description
          </p>

          {/* Job Description Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Job Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[100px] text-sm"
            />
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!resumeId || !jobDescription.trim() || isAnalyzing}
            className="w-full"
            size="sm"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Resume'
            )}
          </Button>

          {/* Results */}
          {hasAnalyzed && (
            <div className="space-y-4 pt-4 border-t">
              {/* Score */}
              <div className="text-center py-3 bg-muted/50 rounded-lg">
                <div className={`text-3xl font-bold ${getScoreColor(atsScore)}`}>
                  {atsScore}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {getScoreLabel(atsScore)}
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">Suggestions</h3>
                </div>

                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => {
                    const Icon =
                      suggestion.category === 'critical' ? AlertCircle :
                      suggestion.category === 'warning' ? AlertCircle :
                      suggestion.category === 'success' ? CheckCircle2 :
                      AlertCircle;

                    const iconColor =
                      suggestion.category === 'critical' ? 'text-red-600' :
                      suggestion.category === 'warning' ? 'text-yellow-600' :
                      suggestion.category === 'success' ? 'text-green-600' :
                      'text-blue-600';

                    const bgColor =
                      suggestion.category === 'critical' ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' :
                      suggestion.category === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800' :
                      suggestion.category === 'success' ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' :
                      'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';

                    return (
                      <div
                        key={index}
                        className={`p-2.5 rounded-lg border ${bgColor}`}
                      >
                        <div className="flex items-start gap-2">
                          <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${iconColor}`} />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs mb-0.5">
                              {suggestion.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {suggestion.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
