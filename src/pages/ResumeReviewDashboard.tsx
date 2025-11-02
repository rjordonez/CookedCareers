import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, FileText, Download, Trash2, Eye, Clock, CheckCircle2, DollarSign, Lock } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useAuthReady } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useSubmitReviewMutation,
  useListSubmissionsQuery,
  useDeleteSubmissionMutation,
} from '@/features/review/reviewService';
import { useGetSubscriptionStatusQuery } from '@/features/subscription/subscriptionService';
import DashboardNav from '@/components/DashboardNav';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function ResumeReviewDashboard() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { authReady } = useAuthReady();
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation();
  const {
    data: submissionsData,
    isLoading: isLoadingSubmissions,
    refetch,
  } = useListSubmissionsQuery(undefined, {
    skip: !authReady || !isSignedIn,
  });
  const [deleteSubmission] = useDeleteSubmissionMutation();

  // Fetch subscription status
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetSubscriptionStatusQuery(undefined, {
    skip: !authReady || !isSignedIn,
  });
  const isPro = subscriptionData?.is_pro ?? false;

  const submissions = submissionsData?.submissions || [];

  const handleFileSelect = async (file: File) => {
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await submitReview(formData).unwrap();

      if (result.success) {
        refetch(); // Refresh the submissions list
      } else {
        console.error('Failed to submit resume');
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const handleDelete = async (submissionId: string) => {
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }

    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      const result = await deleteSubmission(submissionId).unwrap();
      if (result.success) {
        refetch();
      } else {
        console.error('Failed to delete submission');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleViewDetails = (submissionId: string) => {
    navigate(`/resume-review/${submissionId}`);
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const token = await getToken();
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav isPro={isPro} isLoadingSubscription={isLoadingSubscription} />

      <main className="max-w-7xl mx-auto px-6 pt-4 pb-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Resume Review</h1>
          <p className="text-muted-foreground">
            Submit your resume for professional review and get feedback
          </p>
        </div>

        {/* Upload Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Submit Resume for Review</h2>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isSubmitting}
          />

          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                <p className="text-lg font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Drop your resume here or click to upload
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Only PDF files are supported
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Submissions List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Submissions</h2>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>

          {isLoadingSubmissions ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No submissions yet</p>
              <p className="text-sm text-muted-foreground">
                Upload your first resume to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {submission.filename}
                        </div>
                      </TableCell>
                      <TableCell>
                        {submission.status === 'completed' ? (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {submission.status === 'completed' && (
                          submission.paid ? (
                            <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                              <DollarSign className="w-3 h-3 mr-1" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-orange-500 text-orange-500">
                              <Lock className="w-3 h-3 mr-1" />
                              Unpaid
                            </Badge>
                          )
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(submission.submitted_at)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {submission.completed_at
                          ? formatDate(submission.completed_at)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(submission.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {submission.status === 'completed' && submission.paid && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(submission.reviewed_file_url!, `reviewed_${submission.filename}`)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(submission.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
