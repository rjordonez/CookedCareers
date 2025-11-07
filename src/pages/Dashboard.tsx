import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import { Loader2, FileText, Download, Trash2, Clock, CheckCircle2, DollarSign, Lock, MessageSquare, Plus } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useAuthState, useRequireAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useListSubmissionsQuery,
  useDeleteSubmissionMutation,
  useGetAnnotationsQuery,
} from '@/features/review/reviewService';
import DashboardLayout from '@/components/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { querySkipCondition, isPro, isLoadingSubscription } = useAuthState();
  const { requireAuth } = useRequireAuth();
  const { getToken } = useAuth();
  const {
    data: submissionsData,
    isLoading: isLoadingSubmissions,
    refetch,
  } = useListSubmissionsQuery(undefined, {
    skip: querySkipCondition,
  });
  const [deleteSubmission] = useDeleteSubmissionMutation();

  const submissions = submissionsData?.submissions || [];

  const handleDelete = async (submissionId: string) => {
    if (!requireAuth()) return;

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

  return (
    <DashboardLayout isPro={isPro} isLoadingSubscription={isLoadingSubscription}>
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
          <p className="text-muted-foreground">
            Manage your uploaded resumes
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Upload Card */}
          <Card
            className="overflow-hidden border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-2 border-muted-foreground/25 hover:border-primary/50"
            onClick={() => navigate('/resume-review')}
          >
            <div className="aspect-[253/320] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Upload Resume
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add a new resume
                </p>
              </div>
            </div>
            <div className="p-4 bg-background">
              <p className="text-xs text-center text-muted-foreground">
                Create or upload a resume
              </p>
            </div>
          </Card>

          {/* Submission Cards */}
          {isLoadingSubmissions ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden border-0 bg-muted rounded-2xl h-full animate-pulse">
                <div className="aspect-[253/320] bg-gradient-to-br from-gray-200 to-gray-300" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-300 rounded" />
                    <div className="h-6 w-16 bg-gray-300 rounded" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                onView={handleViewDetails}
                onDownload={handleDownload}
                onDelete={handleDelete}
                getToken={getToken}
              />
            ))
          )}
        </div>

        {submissions.length === 0 && !isLoadingSubmissions && (
          <div className="text-center py-12 mt-6">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No resumes yet</p>
            <p className="text-sm text-muted-foreground">
              Upload your first resume to get started
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Submission Card Component
function SubmissionCard({
  submission,
  onView,
  onDownload,
  onDelete,
  getToken,
}: {
  submission: any;
  onView: (id: string) => void;
  onDownload: (url: string, filename: string) => void;
  onDelete: (id: string) => void;
  getToken: () => Promise<string | null>;
}) {
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const { data: annotationsData } = useGetAnnotationsQuery(submission.id, {
    skip: submission.status !== 'completed' || !submission.paid,
  });

  const annotations = annotationsData?.annotations || [];
  const firstPageAnnotations = annotations.filter((a: any) => a.page_number === 0);

  // Fetch PDF with authentication
  useEffect(() => {
    const fetchPdf = async () => {
      setLoadingPdf(true);
      try {
        const token = await getToken();
        const pdfUrl = submission.file_url;

        const response = await fetch(pdfUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error(`Failed to load PDF: ${response.status}`);
        }

        const blob = await response.blob();
        setPdfFile(blob);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setPdfFile(null);
      } finally {
        setLoadingPdf(false);
      }
    };

    fetchPdf();
  }, [submission, getToken]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="relative h-full group">
      <Card
        className="overflow-hidden border-0 bg-muted rounded-2xl hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full"
        onClick={() => onView(submission.id)}
      >
        {/* PDF Preview */}
        <div className="aspect-[253/320] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
          {loadingPdf || !pdfFile ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="w-full h-full bg-white overflow-hidden relative flex items-center justify-center">
              <div className="relative inline-block" style={{ transform: 'scale(0.4)', transformOrigin: 'center' }}>
                <Document
                  file={pdfFile}
                  loading={
                    <div className="p-8 text-center">
                      <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                    </div>
                  }
                  error={
                    <div className="p-8 text-center text-muted-foreground">
                      <p>Preview unavailable</p>
                    </div>
                  }
                >
                  <Page
                    pageNumber={1}
                    scale={1.5}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />

                  {/* Annotation Overlays - Only show if paid and completed */}
                  {submission.status === 'completed' && submission.paid && firstPageAnnotations.map((annotation: any) => (
                    <div
                      key={annotation.id}
                      className="absolute bg-yellow-300/40 border-2 border-yellow-400"
                      style={{
                        left: `${annotation.position.x * 1.5}px`,
                        top: `${annotation.position.y * 1.5}px`,
                        width: `${annotation.position.width * 1.5}px`,
                        height: `${annotation.position.height * 1.5}px`,
                        zIndex: 10,
                      }}
                    >
                      <MessageSquare className="w-2 h-2 text-yellow-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
                    </div>
                  ))}
                </Document>
              </div>
            </div>
          )}
        </div>

        {/* Card Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-sm leading-tight truncate mb-1">
              {submission.filename}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatDate(submission.submitted_at)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              {submission.status === 'completed' ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              )}
              {submission.paid ? (
                <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-xs">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Paid
                </Badge>
              ) : (
                <Badge variant="outline" className="border-orange-500 text-orange-500 text-xs">
                  <Lock className="w-3 h-3 mr-1" />
                  Unpaid
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {submission.status === 'completed' && submission.paid && (
              <Button
                variant="secondary"
                size="sm"
                className="text-xs flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(submission.reviewed_file_url!, `reviewed_${submission.filename}`);
                }}
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(submission.id);
              }}
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
