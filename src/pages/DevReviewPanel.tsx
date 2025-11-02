import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, FileText, ExternalLink, CheckCircle2, MessageSquare, DollarSign } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useAuthReady } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useListSubmissionsQuery } from '@/features/review/reviewService';
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

export default function DevReviewPanel() {
  const navigate = useNavigate();
  const { authReady } = useAuthReady();
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [reviewedFile, setReviewedFile] = useState<File | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch subscription status
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetSubscriptionStatusQuery(undefined, {
    skip: !authReady,
  });
  const isPro = subscriptionData?.is_pro ?? false;

  // Fetch all submissions (admin view - shows all pending)
  const {
    data: submissionsData,
    isLoading: isLoadingSubmissions,
    refetch,
  } = useListSubmissionsQuery(undefined, {
    skip: !authReady,
  });

  const submissions = submissionsData?.submissions || [];
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        return;
      }
      setReviewedFile(file);
    }
  };

  const handleUploadReview = async (submissionId: string) => {
    if (!reviewedFile) {
      return;
    }

    setIsUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', reviewedFile);
      formData.append('notes', reviewNotes);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/review/admin/complete/${submissionId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        setUploadingFor(null);
        setReviewedFile(null);
        setReviewNotes('');
        refetch();
      } else {
        console.error(result.message || 'Failed to upload reviewed resume');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewOriginal = async (url: string) => {
    try {
      const token = await getToken();
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Failed to load PDF');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (error) {
      console.error('Error opening PDF:', error);
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
          <div>
            <h1 className="text-3xl font-bold mb-2">Dev Review Panel</h1>
            <p className="text-muted-foreground">
              Upload reviewed resumes for pending submissions
            </p>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Pending Reviews ({pendingSubmissions.length})
            </h2>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>

          {isLoadingSubmissions ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Loading submissions...</p>
            </div>
          ) : pendingSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium mb-2">All caught up!</p>
              <p className="text-sm text-muted-foreground">
                No pending reviews at the moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <Card key={submission.id} className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left side - Submission info */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Submission ID</p>
                        <p className="text-sm font-mono">{submission.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Filename</p>
                        <p className="text-sm font-medium">{submission.filename}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                        <p className="text-sm">{formatDate(submission.submitted_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Payment Status</p>
                        {submission.paid ? (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                            <DollarSign className="w-3 h-3 mr-1" />
                            Paid
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Unpaid
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="bg-primary"
                          size="sm"
                          onClick={() => navigate(`/dev-review/${submission.id}`)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOriginal(submission.file_url)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Original
                        </Button>
                      </div>
                    </div>

                    {/* Right side - Upload form */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Upload Reviewed Resume
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={handleFileSelect}
                          className="hidden"
                          disabled={isUploading || uploadingFor === submission.id}
                        />
                        <div className="flex gap-2 items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUploadingFor(submission.id);
                              fileInputRef.current?.click();
                            }}
                            disabled={isUploading}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                          {reviewedFile && uploadingFor === submission.id && (
                            <span className="text-sm text-muted-foreground truncate">
                              {reviewedFile.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Review Notes
                        </label>
                        <Textarea
                          placeholder="Add notes about the review..."
                          value={uploadingFor === submission.id ? reviewNotes : ''}
                          onChange={(e) => {
                            if (uploadingFor === submission.id) {
                              setReviewNotes(e.target.value);
                            }
                          }}
                          disabled={isUploading || uploadingFor !== submission.id}
                          rows={3}
                        />
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => handleUploadReview(submission.id)}
                        disabled={
                          isUploading ||
                          uploadingFor !== submission.id ||
                          !reviewedFile
                        }
                      >
                        {isUploading && uploadingFor === submission.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Complete Review
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
