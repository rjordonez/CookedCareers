import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import { ArrowLeft, Download, Loader2, FileText, Clock, CheckCircle2 } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useAuthReady } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetSubmissionQuery } from '@/features/review/reviewService';
import { useGetSubscriptionStatusQuery } from '@/features/subscription/subscriptionService';
import DashboardNav from '@/components/DashboardNav';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function ResumeReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { authReady } = useAuthReady();
  const { getToken } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [viewMode, setViewMode] = useState<'original' | 'reviewed'>('original');
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const {
    data: submissionData,
    isLoading,
    isError,
  } = useGetSubmissionQuery(id!, {
    skip: !authReady || !isSignedIn || !id,
  });

  // Fetch subscription status
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetSubscriptionStatusQuery(undefined, {
    skip: !authReady || !isSignedIn,
  });
  const isPro = subscriptionData?.is_pro ?? false;

  const submission = submissionData?.submission;

  // Fetch PDF with authentication when submission or view mode changes
  useEffect(() => {
    if (!submission) return;

    const url = viewMode === 'original' ? submission.file_url : submission.reviewed_file_url;
    if (!url) return;

    const fetchPdf = async () => {
      setLoadingPdf(true);
      try {
        const token = await getToken();
        const response = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error(`Failed to load PDF: ${response.status}`);
        }

        const blob = await response.blob();
        setPdfFile(blob);
        setCurrentPage(1); // Reset to first page when switching
      } catch (error) {
        console.error('Error loading PDF:', error);
        setPdfFile(null);
      } finally {
        setLoadingPdf(false);
      }
    };

    fetchPdf();
  }, [submission, viewMode, getToken]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (!isSignedIn) {
    navigate('/auth');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav isPro={isPro} isLoadingSubscription={isLoadingSubscription} />
        <main className="max-w-7xl mx-auto px-6 pt-4 pb-6">
          <Card className="p-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary animate-spin" />
            <h2 className="text-2xl font-semibold mb-3">Loading submission...</h2>
          </Card>
        </main>
      </div>
    );
  }

  if (isError || !submission) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav isPro={isPro} isLoadingSubscription={isLoadingSubscription} />
        <main className="max-w-7xl mx-auto px-6 pt-4 pb-6">
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-3">Submission not found</h2>
            <p className="text-muted-foreground mb-6">
              This submission doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/resume-review')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav isPro={isPro} isLoadingSubscription={isLoadingSubscription} />

      <main className="max-w-7xl mx-auto px-6 pt-4 pb-6">
        {/* Main Content - Anonymizer Style Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Submission Info */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/resume-review')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>

            {/* Submission Info Card */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Submission Details</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Filename</p>
                  <p className="text-sm font-medium break-words">{submission.filename}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  {submission.status === 'completed' ? (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Review
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                  <p className="text-sm">{formatDate(submission.submitted_at)}</p>
                </div>

                {submission.completed_at && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Completed</p>
                    <p className="text-sm">{formatDate(submission.completed_at)}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Reviewer Notes */}
            {submission.notes && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Reviewer Notes</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {submission.notes}
                </p>
              </Card>
            )}

            {/* Actions Card */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Actions</h3>
              <div className="space-y-2">
                {submission.status === 'completed' && submission.reviewed_file_url && (
                  <>
                    <Button
                      variant={viewMode === 'original' ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => setViewMode('original')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Original
                    </Button>
                    <Button
                      variant={viewMode === 'reviewed' ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => setViewMode('reviewed')}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      View Reviewed
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDownload(submission.file_url, submission.filename)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Original
                </Button>
                {submission.status === 'completed' && submission.reviewed_file_url && (
                  <Button
                    className="w-full bg-primary"
                    onClick={() => handleDownload(submission.reviewed_file_url!, `reviewed_${submission.filename}`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Reviewed
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Center - PDF Viewer */}
          <div className="col-span-12 lg:col-span-9">
            <Card className="p-6">
              {/* Toolbar */}
              <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === numPages}
                    onClick={() => setCurrentPage((prev) => Math.min(numPages, prev + 1))}
                  >
                    Next
                  </Button>
                  <div className="flex items-center px-3 py-1 bg-gray-100 rounded text-sm font-medium">
                    Page {currentPage} of {numPages}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScale((prev) => Math.max(0.5, prev - 0.25))}
                  >
                    -
                  </Button>
                  <span className="text-sm font-medium min-w-[60px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScale((prev) => Math.min(3, prev + 0.25))}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* PDF Viewer */}
              {submission.status === 'pending' && viewMode === 'reviewed' ? (
                <div className="border-2 rounded-lg p-12 text-center bg-gray-50">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Review in Progress</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your resume is currently being reviewed. The reviewed version will appear here once completed.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </Button>
                </div>
              ) : loadingPdf || !pdfFile ? (
                <div className="border-2 rounded-lg p-12 text-center bg-gray-50">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading PDF...</p>
                </div>
              ) : (
                <div className="border-2 rounded-lg overflow-auto max-h-[800px] bg-gray-100">
                  <div className="flex justify-center p-4">
                    <div className="relative inline-block">
                      <Document
                        file={pdfFile}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={
                          <div className="p-8 text-center">
                            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
                            <p className="text-gray-600">Rendering PDF...</p>
                          </div>
                        }
                        error={
                          <div className="p-8 text-center text-red-600">
                            <p>Failed to load PDF. Please try again.</p>
                          </div>
                        }
                      >
                        <Page
                          pageNumber={currentPage}
                          scale={scale}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    </div>
                  </div>
                </div>
              )}

              {/* Help Text */}
              <p className="text-sm text-gray-500 mt-4 text-center">
                {submission.status === 'completed' && submission.reviewed_file_url
                  ? `Viewing ${viewMode === 'original' ? 'original' : 'reviewed'} resume • Use the sidebar to switch versions`
                  : 'Viewing original resume'}
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
