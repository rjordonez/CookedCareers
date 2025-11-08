import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, ChevronDown } from 'lucide-react';
import { useAuthState, useRequireAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useSubmitReviewMutation,
  useCreateReviewCheckoutMutation,
} from '@/features/review/reviewService';
import { useListUserResumesQuery } from '@/features/user-resume/userResumeService';

export default function ResumeReviewRequest() {
  const navigate = useNavigate();
  const { querySkipCondition, isPro, isLoadingSubscription } = useAuthState();
  const { requireAuth } = useRequireAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExistingResume, setSelectedExistingResume] = useState<string>('');
  const [useExisting, setUseExisting] = useState(false);
  const [context, setContext] = useState('');
  const [reviewer, setReviewer] = useState('team');
  const [speed, setSpeed] = useState('standard');
  const [shouldPayNow, setShouldPayNow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation();
  const [createReviewCheckout, { isLoading: isCreatingCheckout }] = useCreateReviewCheckoutMutation();

  const { data: resumesData } = useListUserResumesQuery(undefined, {
    skip: querySkipCondition,
  });

  const existingResumes = resumesData?.resumes || [];

  const reviewerOptions = [
    { value: 'team', label: 'Cooked Career Team', price: 0, priceDisplay: 'Free', description: 'Professional review by our team' },
    { value: 'big_tech', label: 'Big Tech Recruiter', price: 20, priceDisplay: '$20', description: 'FAANG recruiter expertise' },
    { value: 'startup', label: 'Startup Recruiter', price: 15, priceDisplay: '$15', description: 'Startup hiring perspective' },
    { value: 'technical', label: 'Technical Engineer', price: 10, priceDisplay: '$10', description: 'Technical screening focus' },
  ];

  const speedOptions = [
    { value: 'standard', label: 'Standard (3 days)', price: 0, priceDisplay: 'Free' },
    { value: 'express', label: 'Express (1 day)', price: 19, priceDisplay: '+$19' },
  ];

  const handleFileSelect = (file: File) => {
    if (!requireAuth()) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    setSelectedFile(file);
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

  const getBasePrice = () => {
    const option = reviewerOptions.find(r => r.value === reviewer);
    return option?.price || 0;
  };

  const getDeliveryFee = () => {
    const option = speedOptions.find(s => s.value === speed);
    return option?.price || 0;
  };

  const calculateTotal = () => {
    return getBasePrice() + getDeliveryFee();
  };

  const handleSubmit = async () => {
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
      // Use existing resume - send the user resume ID
      formData.append('existing_resume_id', selectedExistingResume);
    } else {
      // Upload new file
      formData.append('file', selectedFile!);
    }

    // Add new required fields
    if (context) formData.append('review_context', context);
    formData.append('reviewer_type', reviewer);
    formData.append('delivery_speed', speed);
    formData.append('base_price', getBasePrice().toString());
    formData.append('delivery_fee', getDeliveryFee().toString());
    formData.append('total_price', calculateTotal().toString());

    try {
      const result = await submitReview(formData).unwrap();

      if (result.success) {
        const totalCost = calculateTotal();

        // If there's a cost AND user chose to pay now, redirect to checkout
        if (totalCost > 0 && shouldPayNow) {
          const checkoutResult = await createReviewCheckout(result.submission_id).unwrap();
          if (checkoutResult.checkout_url) {
            window.location.href = checkoutResult.checkout_url;
          }
        } else {
          // Free submission OR pay later, redirect to dashboard
          navigate('/resume-review/dashboard');
        }
      } else {
        alert('Failed to submit review request');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting your request');
    }
  };

  return (
    <DashboardLayout isPro={isPro} isLoadingSubscription={isLoadingSubscription}>
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resume Review Request</h1>
          <p className="text-muted-foreground">
            Get professional feedback on your resume
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => navigate('/resume-review')}
            className="px-4 py-2 font-medium text-sm border-b-2 border-primary text-primary"
          >
            New Request
          </button>
          <button
            onClick={() => navigate('/resume-review/dashboard')}
            className="px-4 py-2 font-medium text-sm text-muted-foreground hover:text-foreground"
          >
            My Reviews
          </button>
        </div>

        <div className="space-y-6">
          {/* File Upload */}
          <Card className="p-6">
            <Label className="text-base font-semibold mb-4 block">Select Resume for Review</Label>

            <div className="space-y-4">
              {/* Toggle between upload and existing */}
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  variant={!useExisting ? "default" : "outline"}
                  onClick={() => {
                    setUseExisting(false);
                    setSelectedExistingResume('');
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
                  <Select value={selectedExistingResume} onValueChange={setSelectedExistingResume}>
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

          {/* Context */}
          <Card className="p-6">
            <Label className="text-base font-semibold mb-4 block">Context for Review</Label>
            <Textarea
              placeholder="Tell us about the roles you're targeting, specific concerns, or areas you'd like us to focus on..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[120px]"
            />
          </Card>

          {/* Reviewer Selection */}
          <Card className="p-6">
            <Label className="text-base font-semibold mb-4 block">Choose Your Reviewer</Label>
            <RadioGroup value={reviewer} onValueChange={setReviewer}>
              <div className="space-y-3">
                {reviewerOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      reviewer === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => setReviewer(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="font-semibold cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{option.priceDisplay}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>

          {/* Speed Selection */}
          <Card className="p-6">
            <Label className="text-base font-semibold mb-4 block">Delivery Speed</Label>
            <RadioGroup value={speed} onValueChange={setSpeed}>
              <div className="space-y-3">
                {speedOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      speed === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => setSpeed(option.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={`speed-${option.value}`} />
                      <Label htmlFor={`speed-${option.value}`} className="font-semibold cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                    <p className="font-bold text-lg">{option.priceDisplay}</p>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>

          {/* Payment Timing - Only show if there's a cost */}
          {calculateTotal() > 0 && (
            <Card className="p-6">
              <Label className="text-base font-semibold mb-4 block">Payment Timing</Label>
              <RadioGroup value={shouldPayNow ? 'now' : 'later'} onValueChange={(val) => setShouldPayNow(val === 'now')}>
                <div className="space-y-3">
                  <div
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      !shouldPayNow
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => setShouldPayNow(false)}
                  >
                    <RadioGroupItem value="later" id="pay-later" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="pay-later" className="font-semibold cursor-pointer">
                        Pay After Review
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Submit now, pay only after you receive and approve the review
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      shouldPayNow
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => setShouldPayNow(true)}
                  >
                    <RadioGroupItem value="now" id="pay-now" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="pay-now" className="font-semibold cursor-pointer">
                        Pay Now
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete payment immediately to prioritize your review
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </Card>
          )}

          {/* Total and Submit */}
          <Card className="p-6 bg-muted">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-semibold">Total Cost</p>
              <p className="text-2xl font-bold">
                {calculateTotal() === 0 ? 'Free' : `$${calculateTotal()}`}
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={(!selectedFile && !selectedExistingResume) || isSubmitting || isCreatingCheckout}
              className="w-full h-12 text-base font-semibold"
            >
              {isSubmitting || isCreatingCheckout ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : shouldPayNow && calculateTotal() > 0 ? (
                'Submit & Pay Now'
              ) : (
                'Submit Request'
              )}
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
