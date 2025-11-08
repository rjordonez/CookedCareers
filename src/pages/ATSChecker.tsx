import { useState, useRef } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { useAuthState, useRequireAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import { useListSubmissionsQuery } from '@/features/review/reviewService';
import { useAnalyzeResumeMutation } from '@/features/ats/atsService';
import type { ATSSuggestion } from '@/features/ats/atsTypes';

export default function ATSChecker() {
  const { querySkipCondition, isPro, isLoadingSubscription } = useAuthState();
  const { requireAuth } = useRequireAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExistingResume, setSelectedExistingResume] = useState<string>('');
  const [useExisting, setUseExisting] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [suggestions, setSuggestions] = useState<ATSSuggestion[]>([]);

  const { data: submissionsData } = useListSubmissionsQuery(undefined, {
    skip: querySkipCondition,
  });

  const [analyzeResume, { isLoading: isAnalyzing }] = useAnalyzeResumeMutation();

  const existingResumes = submissionsData?.submissions || [];

  const handleFileSelect = (file: File) => {
    if (!requireAuth()) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    setSelectedFile(file);
    setHasAnalyzed(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAnalyze = async () => {
    if (!requireAuth()) return;

    if (!useExisting && !selectedFile) {
      alert('Please select a resume file or choose an existing resume');
      return;
    }

    if (useExisting && !selectedExistingResume) {
      alert('Please select an existing resume');
      return;
    }

    const formData = new FormData();

    if (useExisting) {
      formData.append('existing_submission_id', selectedExistingResume);
    } else {
      formData.append('file', selectedFile!);
    }

    if (jobDescription) {
      formData.append('job_description', jobDescription);
    }

    try {
      const result = await analyzeResume(formData).unwrap();

      if (result.success) {
        setAtsScore(result.score);
        setSuggestions(result.suggestions);
        setHasAnalyzed(true);
      } else {
        alert('Failed to analyze resume');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('An error occurred while analyzing your resume');
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
    <DashboardLayout isPro={isPro} isLoadingSubscription={isLoadingSubscription}>
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ATS Checker</h1>
          <p className="text-muted-foreground">
            Check how well your resume performs with Applicant Tracking Systems
          </p>
        </div>

        <div className="space-y-6">
          {/* File Upload/Selection */}
          <Card className="p-6">
            <Label className="text-base font-semibold mb-4 block">Select Resume to Analyze</Label>

            <div className="space-y-4">
              {/* Toggle between upload and existing */}
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  variant={!useExisting ? "default" : "outline"}
                  onClick={() => {
                    setUseExisting(false);
                    setSelectedExistingResume('');
                    setHasAnalyzed(false);
                  }}
                  className="flex-1"
                >
                  Upload New
                </Button>
                <Button
                  type="button"
                  variant={useExisting ? "default" : "outline"}
                  onClick={() => {
                    setUseExisting(true);
                    setSelectedFile(null);
                    setHasAnalyzed(false);
                  }}
                  className="flex-1"
                >
                  Use Existing
                </Button>
              </div>

              {!useExisting ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedFile ? (
                      <div>
                        <Upload className="w-12 h-12 mx-auto mb-3 text-primary" />
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">
                          Drop your resume here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF files only
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <Select value={selectedExistingResume} onValueChange={(value) => {
                    setSelectedExistingResume(value);
                    setHasAnalyzed(false);
                  }}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Choose from your uploaded resumes" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingResumes.length === 0 ? (
                        <SelectItem value="no-resumes" disabled>
                          No resumes found
                        </SelectItem>
                      ) : (
                        existingResumes.map((resume) => (
                          <SelectItem key={resume.id} value={resume.id}>
                            {resume.filename}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

            </div>
          </Card>

          {/* Job Description (Optional) */}
          <Card className="p-6">
            <Label className="text-base font-semibold mb-4 block">
              Job Description (Optional)
            </Label>
            <p className="text-sm text-muted-foreground mb-4">
              Paste the job description to get tailored feedback on how well your resume matches the role.
            </p>
            <Textarea
              placeholder="Paste the job description here to compare your resume against specific requirements..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[150px]"
            />
          </Card>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={(!selectedFile && !selectedExistingResume) || isAnalyzing}
            className="w-full h-12 text-base font-semibold"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Resume'
            )}
          </Button>

          {/* Results Section */}
          {hasAnalyzed && (
            <>
              {/* ATS Score with Half-Wheel Gauge */}
              <Card className="p-8">
                <h2 className="text-xl font-semibold mb-6 text-center">ATS Score</h2>

                {/* Half-Wheel Gauge */}
                <div className="relative w-64 h-32 mx-auto mb-6">
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    {/* Background Arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />

                    {/* Rainbow Gradient Arc */}
                    <defs>
                      <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="25%" stopColor="#f97316" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="75%" stopColor="#84cc16" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>

                    {/* Score Arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="url(#rainbow)"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeDasharray={`${(atsScore / 100) * 251} 251`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  {/* Score Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                    <div className={`text-5xl font-bold ${getScoreColor(atsScore)}`}>
                      {atsScore}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {getScoreLabel(atsScore)}
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Your resume scores {atsScore} out of 100 for ATS compatibility
                </p>
              </Card>

              {/* Suggestions Section */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Suggestions to Improve</h2>
                </div>

                <div className="space-y-4">
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
                      suggestion.category === 'critical' ? 'bg-red-50 border-red-200' :
                      suggestion.category === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      suggestion.category === 'success' ? 'bg-green-50 border-green-200' :
                      'bg-blue-50 border-blue-200';

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${bgColor}`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">
                              {suggestion.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {suggestion.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
