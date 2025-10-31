import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import { ArrowLeft, Download, Loader2, MessageSquare, CheckCircle2, Clock, FileText } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useAuthReady } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetSubmissionQuery, useGetAnnotationsQuery } from '@/features/review/reviewService';
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
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const {
    data: submissionData,
    isLoading,
    isError,
  } = useGetSubmissionQuery(id!, {
    skip: !authReady || !isSignedIn || !id,
  });

  // Fetch annotations for this submission
  const { data: annotationsData } = useGetAnnotationsQuery(id!, {
    skip: !authReady || !isSignedIn || !id,
  });

  // Fetch subscription status
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetSubscriptionStatusQuery(undefined, {
    skip: !authReady || !isSignedIn,
  });
  const isPro = subscriptionData?.is_pro ?? false;

  const submission = submissionData?.submission;
  const annotations = annotationsData?.annotations || [];
  const currentPageAnnotations = annotations.filter((a) => a.page_number === currentPage - 1);

  // Fetch PDF with authentication when submission changes
  useEffect(() => {
    if (!submission?.file_url) return;

    const fetchPdf = async () => {
      setLoadingPdf(true);
      try {
        const token = await getToken();
        const response = await fetch(submission.file_url, {
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

            {/* Actions Card */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDownload(submission.file_url, submission.filename)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
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
              {loadingPdf || !pdfFile ? (
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

                        {/* Annotation Overlays */}
                        {currentPageAnnotations.map((annotation) => (
                          <div
                            key={annotation.id}
                            className="absolute bg-yellow-300/40 border-2 border-yellow-400 cursor-pointer hover:bg-yellow-300/60 transition-all group"
                            style={{
                              left: `${annotation.position.x * scale}px`,
                              top: `${annotation.position.y * scale}px`,
                              width: `${annotation.position.width * scale}px`,
                              height: `${annotation.position.height * scale}px`,
                              zIndex: 10,
                              pointerEvents: 'auto',
                            }}
                            title={annotation.content.comment}
                          >
                            <div className="absolute -top-8 left-0 bg-yellow-500 text-white text-xs px-2 py-1 rounded shadow-lg max-w-xs whitespace-normal opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                              {annotation.content.comment}
                            </div>
                            <MessageSquare className="w-3 h-3 text-yellow-600 absolute top-0 right-0 -mt-1 -mr-1 bg-white rounded-full p-0.5" />
                          </div>
                        ))}
                      </Document>
                    </div>
                  </div>
                </div>
              )}

              {/* Help Text */}
              <p className="text-sm text-gray-500 mt-4 text-center">
                {submission.status === 'completed'
                  ? 'Viewing your resume with reviewer feedback'
                  : 'Your resume is being reviewed'}
                {annotations.length > 0 && (
                  <span> • Hover over yellow highlights to see feedback</span>
                )}
              </p>
            </Card>

            {/* Reviewer Notes - Below PDF */}
            {submission.notes && (
              <Card className="p-6 mt-6">
                <h3 className="font-semibold mb-3 text-lg">Reviewer Notes</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {submission.notes}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
