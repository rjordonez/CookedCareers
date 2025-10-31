import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import { ArrowLeft, Download, Loader2, MessageSquare, Trash2, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useAuthReady } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  useGetSubmissionQuery,
  useGetAnnotationsQuery,
  useCreateAnnotationMutation,
  useDeleteAnnotationMutation,
} from '@/features/review/reviewService';
import { useGetSubscriptionStatusQuery } from '@/features/subscription/subscriptionService';
import type { Annotation } from '@/features/review/reviewTypes';
import DashboardNav from '@/components/DashboardNav';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function DevReviewDetailPanel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authReady } = useAuthReady();
  const { getToken } = useAuth();
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  // Annotation state
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [hasTextSelection, setHasTextSelection] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [pendingAnnotation, setPendingAnnotation] = useState<{
    pageNumber: number;
    position: { x: number; y: number; width: number; height: number };
    selectedText: string;
  } | null>(null);
  const [commentText, setCommentText] = useState('');

  // Review completion state
  const [reviewNotes, setReviewNotes] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch submission
  const {
    data: submissionData,
    isLoading,
    isError,
  } = useGetSubmissionQuery(id!, {
    skip: !authReady || !id,
  });

  // Fetch annotations
  const {
    data: annotationsData,
    refetch: refetchAnnotations,
  } = useGetAnnotationsQuery(id!, {
    skip: !authReady || !id,
  });

  // Fetch subscription status
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetSubscriptionStatusQuery(undefined, {
    skip: !authReady,
  });
  const isPro = subscriptionData?.is_pro ?? false;

  const [createAnnotation] = useCreateAnnotationMutation();
  const [deleteAnnotation] = useDeleteAnnotationMutation();

  const submission = submissionData?.submission;
  const annotations = annotationsData?.annotations || [];

  // Fetch PDF
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

  // Handle text selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      setHasTextSelection(!!selection && selection.toString().trim().length > 0);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const handleToggleAnnotationMode = () => {
    if (isAnnotationMode && hasTextSelection) {
      handleCreateAnnotationFromSelection();
    } else {
      setIsAnnotationMode(!isAnnotationMode);
    }
  };

  const handleCancelAnnotationMode = () => {
    setIsAnnotationMode(false);
    window.getSelection()?.removeAllRanges();
    setHasTextSelection(false);
  };

  const handleCreateAnnotationFromSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (!rect || rect.width === 0 || rect.height === 0) return;

    const container = pdfContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const position = {
      x: (rect.left - containerRect.left) / scale,
      y: (rect.top - containerRect.top) / scale,
      width: rect.width / scale,
      height: rect.height / scale,
    };

    setPendingAnnotation({
      pageNumber: currentPage - 1,
      position,
      selectedText: selection.toString().trim(),
    });
    setShowCommentDialog(true);
  };

  const handleSaveAnnotation = async () => {
    if (!pendingAnnotation || !commentText.trim()) {
      return;
    }

    try {
      await createAnnotation({
        submission_id: id!,
        annotation_type: 'highlight',
        page_number: pendingAnnotation.pageNumber,
        position: pendingAnnotation.position,
        content: {
          selectedText: pendingAnnotation.selectedText,
          comment: commentText.trim(),
        },
      }).unwrap();

      setShowCommentDialog(false);
      setPendingAnnotation(null);
      setCommentText('');
      setIsAnnotationMode(false);
      window.getSelection()?.removeAllRanges();
      setHasTextSelection(false);
      refetchAnnotations();
    } catch (error) {
      console.error('Error creating annotation:', error);
    }
  };

  const handleDeleteAnnotation = async (annotationId: string) => {
    try {
      await deleteAnnotation(annotationId).unwrap();
      refetchAnnotations();
    } catch (error) {
      console.error('Error deleting annotation:', error);
    }
  };

  const handleCompleteReview = async () => {
    // Require at least annotations or notes
    if (annotations.length === 0 && !reviewNotes.trim()) {
      return;
    }

    setIsCompleting(true);
    try {
      const token = await getToken();

      // Backend will generate the reviewed PDF from annotations
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/review/admin/complete/${id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notes: reviewNotes,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        navigate('/dev-review');
      } else {
        console.error(result.message || 'Failed to complete review');
      }
    } catch (error) {
      console.error('Complete review error:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const currentPageAnnotations = annotations.filter((a) => a.page_number === currentPage - 1);

  if (isLoading || loadingPdf) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav isPro={isPro} isLoadingSubscription={isLoadingSubscription} />
        <main className="max-w-7xl mx-auto px-6 pt-4 pb-6">
          <Card className="p-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary animate-spin" />
            <h2 className="text-2xl font-semibold mb-3">Loading...</h2>
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
            <h2 className="text-2xl font-semibold mb-3">Submission not found</h2>
            <Button onClick={() => navigate('/dev-review')}>
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
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/dev-review')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>

            {/* Submission Info */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Submission Details</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Filename</p>
                  <p className="text-sm font-medium break-words">{submission.filename}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="secondary">Reviewing</Badge>
                </div>
              </div>
            </Card>

            {/* Annotations List */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Annotations ({annotations.length})</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {annotations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No annotations yet</p>
                ) : (
                  annotations.map((annotation) => (
                    <div
                      key={annotation.id}
                      className="p-2 border rounded-lg hover:bg-accent cursor-pointer group"
                      onClick={() => setCurrentPage(annotation.page_number + 1)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Page {annotation.page_number + 1}</p>
                          {annotation.content.selectedText && (
                            <p className="text-xs font-medium text-primary truncate">
                              "{annotation.content.selectedText}"
                            </p>
                          )}
                          <p className="text-sm mt-1">{annotation.content.comment}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAnnotation(annotation.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Annotation Actions */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Add Annotations</h3>
              <div className="space-y-2">
                <Button
                  variant={isAnnotationMode ? "default" : "outline"}
                  className="w-full"
                  onClick={handleToggleAnnotationMode}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {isAnnotationMode ? (hasTextSelection ? 'Add Comment' : 'Selection Mode Active') : 'Enable Text Selection'}
                </Button>
                {isAnnotationMode && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleCancelAnnotationMode}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel Selection Mode
                  </Button>
                )}
              </div>
            </Card>

            {/* Complete Review */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Complete Review</h3>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>{annotations.length}</strong> annotation{annotations.length !== 1 ? 's' : ''} added
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    The reviewed PDF will be automatically generated with your annotations
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    General Review Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add general notes about the review..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  className="w-full bg-primary"
                  onClick={handleCompleteReview}
                  disabled={isCompleting || (annotations.length === 0 && !reviewNotes.trim())}
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete Review & Generate PDF
                    </>
                  )}
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

              {/* PDF Viewer with Annotations */}
              <div className="border-2 rounded-lg overflow-auto max-h-[800px] bg-gray-100 relative">
                {isAnnotationMode && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium z-10">
                    Selection Mode: Highlight text to add feedback
                  </div>
                )}
                <div className="flex justify-center p-4">
                  <div
                    ref={pdfContainerRef}
                    className="relative inline-block"
                    style={{ userSelect: isAnnotationMode ? 'text' : 'none' }}
                  >
                    <Document
                      file={pdfFile}
                      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                      loading={
                        <div className="p-8 text-center">
                          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
                          <p className="text-gray-600">Loading PDF...</p>
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
                        renderTextLayer={isAnnotationMode}
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
                          <div className="absolute -top-8 left-0 bg-yellow-500 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {annotation.content.comment}
                          </div>
                        </div>
                      ))}
                    </Document>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4 text-center">
                {isAnnotationMode
                  ? 'Highlight text on the PDF and click "Add Comment" to add feedback'
                  : 'Hover over highlights to see feedback • Enable text selection to add new annotations'}
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              {pendingAnnotation?.selectedText && (
                <span className="text-sm">
                  Selected: "<span className="font-medium text-primary">{pendingAnnotation.selectedText}</span>"
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your feedback..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCommentDialog(false);
              setPendingAnnotation(null);
              setCommentText('');
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveAnnotation} disabled={!commentText.trim()}>
              Add Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
