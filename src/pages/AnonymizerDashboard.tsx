import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { Download, Eye, EyeOff, Loader2, Wand2, X, Share2, Copy, Check } from 'lucide-react';
import { useAuthState, useRequireAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import {
  setCurrentPage,
  setScale,
  setNumPages,
  setSessionId,
  setFileId,
  setFilename,
  setOriginalUrl,
  setDetections,
  toggleDetectionBlur,
  toggleAllBlur,
  setReplacementText,
  addManualBlur,
  removeManualBlur,
  resetAnonymizer,
} from '@/features/anonymizer/anonymizerSlice';
import {
  useDetectPIIMutation,
  useGenerateAnonymizedPDFMutation,
  useLoadSessionQuery,
  useSaveSessionMutation,
  useCreateShareLinkMutation,
} from '@/features/anonymizer/anonymizerService';
import SessionsList from '@/components/SessionsList';
import {
  PII_TYPE_COLORS,
  type PIIDetection,
  type PIIDetectionWithBlur,
} from '@/features/anonymizer/anonymizerTypes';
import DashboardNav from '@/components/DashboardNav';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function AnonymizerDashboard() {
  const { querySkipCondition, isPro, isLoadingSubscription, authReady, isSignedIn } = useAuthState();
  const { requireAuth } = useRequireAuth();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [hasTextSelection, setHasTextSelection] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const { currentPage, scale, numPages, sessionId, fileId, filename, originalUrl, detections, manualBlurs } = useAppSelector(
    (state) => state.anonymizer
  );

  const [detectPII, { isLoading: isDetecting }] = useDetectPIIMutation();
  const [generateAnonymizedPDF, { isLoading: isGenerating }] =
    useGenerateAnonymizedPDFMutation();
  const [saveSession] = useSaveSessionMutation();
  const [createShareLink, { isLoading: isCreatingShare }] = useCreateShareLinkMutation();

  // Load session data when a session is selected
  const { data: sessionData } = useLoadSessionQuery(
    selectedSessionId || '',
    { skip: !selectedSessionId }
  );

  // Handle text selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      setHasTextSelection(!!selection && selection.toString().trim().length > 0);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // Load session data when selected
  useEffect(() => {
    if (sessionData?.success && sessionData.session) {
      const session = sessionData.session;
      setIsRestoringSession(true);

      // Update Redux state
      dispatch(setSessionId(session.session_id));
      dispatch(setFileId(session.file_id));
      dispatch(setFilename(session.filename));
      dispatch(setOriginalUrl(session.original_url));
      dispatch(setDetections(session.detections));
      dispatch(setNumPages(session.num_pages));

      // Handle manual blurs if they exist
      if (session.manual_blurs && session.manual_blurs.length > 0) {
        session.manual_blurs.forEach((blur) => {
          dispatch(addManualBlur(blur));
        });
      }

      // Fetch PDF
      fetch(session.original_url)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], session.filename, { type: 'application/pdf' });
          setPdfFile(file);
          setView('editor');
        })
        .catch((error) => {
          console.error('Failed to load PDF:', error);
        })
        .finally(() => {
          setIsRestoringSession(false);
        });
    }
  }, [sessionData, dispatch]);

  // Save current session to backend
  const saveCurrentSession = useCallback(async () => {
    if (!fileId || !filename || detections.length === 0) {
      return; // Nothing to save
    }

    try {
      await saveSession({
        session_id: sessionId || undefined,
        file_id: fileId,
        filename,
        original_url: originalUrl,
        detections,
        manual_blurs: manualBlurs,
        num_pages: numPages,
      }).unwrap();
    } catch (error) {
      console.error('Failed to save session:', error);
      // Don't throw - we don't want to block user actions
    }
  }, [fileId, filename, detections, manualBlurs, numPages, sessionId, originalUrl, saveSession]);

  // Save on window close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (view === 'editor' && fileId && detections.length > 0) {
        // Modern browsers ignore custom messages, but we still call the function
        saveCurrentSession();
        // Some browsers require returnValue to be set
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [view, fileId, detections, saveCurrentSession]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!requireAuth()) return;

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return;
    }

    // Reset state before uploading new file
    dispatch(resetAnonymizer());
    setPdfFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await detectPII(formData).unwrap();

      if (result.success) {
        dispatch(setFileId(result.file_id));
        dispatch(setFilename(file.name));
        dispatch(setOriginalUrl(result.original_url));
        // Initialize all detections as blurred with unique IDs
        const detectionsWithBlur: PIIDetectionWithBlur[] = result.detections.map(
          (d: PIIDetection, idx: number) => ({
            ...d,
            blurred: true,
            id: `detection-${idx}-${Date.now()}`, // Add unique ID
          })
        );
        dispatch(setDetections(detectionsWithBlur));
        dispatch(setNumPages(result.total_pages));

        // Save initial session to backend
        try {
          const saveResult = await saveSession({
            file_id: result.file_id,
            filename: file.name,
            original_url: result.original_url,
            detections: detectionsWithBlur,
            manual_blurs: [],
            num_pages: result.total_pages,
          }).unwrap();

          if (saveResult.success) {
            dispatch(setSessionId(saveResult.session_id));
          }
        } catch (error) {
          console.error('Failed to save session:', error);
          // Don't show error to user - session will be saved on next change
        }

        setView('editor');
      } else {
        console.error(result.error || 'Failed to analyze PDF');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDownload = async () => {
    if (!requireAuth()) return;
    // Save before generating PDF
    await saveCurrentSession();

    try {
      console.log('📥 Download requested');
      console.log('Total detections:', detections.length);
      console.log('Total manual blurs:', manualBlurs.length);

      // Build replacements array from detected PII
      const piiReplacements = detections
        .filter((d) => d.blurred || d.replacementText) // Include if blurred or has replacement
        .map((d) => ({
          page: d.page,
          bbox: d.bbox,
          original_text: d.text,
          replacement_text: d.replacementText || '', // Empty string means just blur/redact
          type: d.type,
          style: d.style, // Pass original styling
        }));

      console.log('PII replacements to send:', piiReplacements.length);
      console.log('PII replacements:', piiReplacements);

      // Add manual blur regions as simple redactions
      const manualReplacements = manualBlurs.map((blur) => ({
        page: blur.page,
        bbox: blur.bbox,
        original_text: '',
        replacement_text: '',
        type: 'manual',
        style: { font_name: '', font_size: 0, color: 0, flags: 0 }, // Empty style for redaction
      }));

      console.log('Manual blur replacements:', manualReplacements.length);

      // Combine both types of replacements
      const allReplacements = [...piiReplacements, ...manualReplacements];

      console.log('Total replacements being sent:', allReplacements.length);
      console.log('File ID:', fileId);

      const result = await generateAnonymizedPDF({
        file_id: fileId,
        replacements: allReplacements,
      }).unwrap();

      console.log('Backend response:', result);

      if (result.success && result.anonymized_url) {
        // Fetch the PDF as a blob to avoid cross-origin download issues
        const response = await fetch(result.anonymized_url);
        const blob = await response.blob();

        // Create a local blob URL
        const blobUrl = URL.createObjectURL(blob);

        // Trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'anonymized-resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
      } else {
        console.error(result.error || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('Failed to generate anonymized PDF:', error);
    }
  };

  const resetUpload = async () => {
    if (!requireAuth()) return;
    // Save before leaving editor
    await saveCurrentSession();

    setPdfFile(null);
    dispatch(resetAnonymizer());
    setSelectedSessionId(null);
    setView('list');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectSession = (sessionId: string) => {
    if (!requireAuth()) return;
    setSelectedSessionId(sessionId);
    // The useEffect will handle loading the session data
  };

  const handleUploadNew = () => {
    if (!requireAuth()) return;
    dispatch(resetAnonymizer());
    setPdfFile(null);
    setSelectedSessionId(null);
    // Just trigger file picker directly, no view change
    fileInputRef.current?.click();
  };

  const handleShare = async () => {
    if (!requireAuth()) return;

    if (!sessionId) {
      return;
    }

    // Save current state before creating share link
    await saveCurrentSession();

    try {
      const result = await createShareLink({ session_id: sessionId }).unwrap();

      if (result.success) {
        setShareUrl(result.share_url);
        setShowShareModal(true);
        setCopied(false);
      } else {
        console.error(result.error || 'Failed to create share link');
      }
    } catch (error) {
      console.error('Failed to create share link:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleToggleAllBlur = (shouldBlur: boolean) => {
    if (!requireAuth()) return;
    dispatch(toggleAllBlur(shouldBlur));
  };

  const handleSetReplacementText = (index: number, text: string) => {
    if (!requireAuth()) return;
    dispatch(setReplacementText({ index, text }));
  };

  const handleToggleSelectionMode = () => {
    if (!requireAuth()) return;
    if (isSelectionMode && hasTextSelection) {
      handleBlurSelection();
    } else {
      setIsSelectionMode(!isSelectionMode);
    }
  };

  const handleCancelSelectionMode = () => {
    if (!requireAuth()) return;
    setIsSelectionMode(false);
    window.getSelection()?.removeAllRanges();
    setHasTextSelection(false);
  };

  const handleRemoveManualBlur = (blurId: string) => {
    if (!requireAuth()) return;
    dispatch(removeManualBlur(blurId));
  };

  const handlePageNavigation = (page: number) => {
    if (!requireAuth()) return;
    dispatch(setCurrentPage(page));
  };

  const handleScaleChange = (newScale: number) => {
    if (!requireAuth()) return;
    dispatch(setScale(newScale));
  };

  const handleBlurSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();

    if (rects.length === 0) return;

    // Get the PDF container's position to calculate relative coordinates
    const container = pdfContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    // Create blur regions for each rect (handles multi-line selections)
    Array.from(rects).forEach((rect) => {
      const x = (rect.left - containerRect.left) / scale;
      const y = (rect.top - containerRect.top) / scale;
      const width = rect.width / scale;
      const height = rect.height / scale;

      if (width > 1 && height > 1) {
        dispatch(addManualBlur({
          page: currentPage - 1,
          bbox: { x, y, width, height },
          id: `manual-${Date.now()}-${Math.random()}`,
        }));
      }
    });

    // Clear selection
    selection.removeAllRanges();
    setHasTextSelection(false);
  };

  // Helper: Check if two bounding boxes overlap
  const bboxesOverlap = (bbox1: any, bbox2: any) => {
    return !(
      bbox1.x + bbox1.width < bbox2.x ||
      bbox2.x + bbox2.width < bbox1.x ||
      bbox1.y + bbox1.height < bbox2.y ||
      bbox2.y + bbox2.height < bbox1.y
    );
  };

  // Helper: Find all overlapping detections
  const findOverlappingDetections = (clickedDetection: PIIDetectionWithBlur) => {
    return detections.filter(
      (d) => d.page === clickedDetection.page && bboxesOverlap(d.bbox, clickedDetection.bbox)
    );
  };

  // Helper: Toggle detection with overlap support
  const handleDetectionToggle = (clickedDetection: PIIDetectionWithBlur) => {
    if (!requireAuth()) return;
    const overlapping = findOverlappingDetections(clickedDetection);

    // Toggle all overlapping detections
    overlapping.forEach((d) => {
      const idx = detections.findIndex((det) => det.id === d.id);
      if (idx !== -1) {
        dispatch(toggleDetectionBlur(idx));
      }
    });
  };

  const currentPageDetections = detections.filter((d) => d.page === currentPage - 1);
  const currentPageManualBlurs = manualBlurs.filter((b) => b.page === currentPage - 1);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav isPro={isPro} isLoadingSubscription={isLoadingSubscription} />

      <main className="max-w-7xl mx-auto px-6 pt-4 pb-6">

        {/* Hidden file input for upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="pdf-upload"
          disabled={isDetecting}
        />

        {/* Sessions List View */}
        {view === 'list' && !isDetecting && !isRestoringSession && (
          <SessionsList
            onSelectSession={handleSelectSession}
            onUploadNew={handleUploadNew}
            authReady={authReady}
            isSignedIn={isSignedIn}
          />
        )}

        {/* Loading State */}
        {(isDetecting || isRestoringSession) && (
          <Card className="p-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary animate-spin" />
            <h2 className="text-2xl font-semibold mb-3">
              {isDetecting ? 'Analyzing Your Resume' : 'Loading...'}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {isDetecting
                ? "We're scanning your document for personal information like names, emails, phone numbers, and addresses. This will only take a moment..."
                : 'Please wait...'}
            </p>
          </Card>
        )}

        {/* Main Content */}
        {view === 'editor' && pdfFile && !isDetecting && !isRestoringSession && (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Controls */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              {/* Replacement Text Inputs */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Replace Text</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Enter custom text to replace detected information
                </p>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {detections.map((detection, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <Label className="text-xs capitalize flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            PII_TYPE_COLORS[detection.type] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {detection.type}
                        </span>
                      </Label>
                      <div className="text-xs text-muted-foreground truncate">
                        Original: {detection.text}
                      </div>
                      <Input
                        placeholder={`Replace with... (e.g., "T200 School")`}
                        value={detection.replacementText || ''}
                        onChange={(e) =>
                          handleSetReplacementText(idx, e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant={isSelectionMode ? "default" : "outline"}
                    className="w-full"
                    onClick={handleToggleSelectionMode}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {isSelectionMode ? (hasTextSelection ? 'Blur Selected Text' : 'Selection Mode Active') : 'Enable Text Selection'}
                  </Button>
                  {isSelectionMode && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={handleCancelSelectionMode}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Selection Mode
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleToggleAllBlur(true)}
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Blur All
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleToggleAllBlur(false)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Show All
                  </Button>
                  <Button
                    className="w-full bg-primary"
                    onClick={handleDownload}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShare}
                    disabled={isCreatingShare || !sessionId}
                  >
                    {isCreatingShare ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Link...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Link
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={resetUpload}>
                    Back to List
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
                      onClick={() => handlePageNavigation(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === numPages}
                      onClick={() => handlePageNavigation(currentPage + 1)}
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
                      onClick={() => handleScaleChange(Math.max(0.5, scale - 0.25))}
                    >
                      -
                    </Button>
                    <span className="text-sm font-medium min-w-[60px] text-center">
                      {Math.round(scale * 100)}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScaleChange(Math.min(3, scale + 0.25))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* PDF Viewer with Blur Overlays */}
                <div className="border-2 rounded-lg overflow-auto max-h-[800px] bg-gray-100 relative">
                  {isSelectionMode && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium z-10">
                      Selection Mode: Highlight text to blur
                    </div>
                  )}
                  <div className="flex justify-center p-4">
                    <div
                      ref={pdfContainerRef}
                      className="relative inline-block"
                      style={{ userSelect: isSelectionMode ? 'text' : 'none' }}
                    >
                      <Document
                        file={pdfFile}
                        onLoadSuccess={({ numPages }) =>
                          dispatch(setNumPages(numPages))
                        }
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
                          renderTextLayer={isSelectionMode}
                          renderAnnotationLayer={false}
                        />

                        {/* Blur Overlays and Replacement Text */}
                        {currentPageDetections.map((detection) => {
                          const hasReplacement = detection.replacementText && detection.replacementText.trim();

                          return (
                            <div
                              key={detection.id || `${detection.page}-${detection.type}-${detection.bbox.x}-${detection.bbox.y}`}
                              className="absolute cursor-pointer transition-all group"
                              style={{
                                left: `${detection.bbox.x * scale}px`,
                                top: `${detection.bbox.y * scale}px`,
                                width: `${detection.bbox.width * scale}px`,
                                height: `${detection.bbox.height * scale}px`,
                                zIndex: 10,
                                pointerEvents: 'auto',
                              }}
                              onClick={() => handleDetectionToggle(detection)}
                              title={detection.blurred ? "Click to unblur" : "Click to blur"}
                            >
                              {/* Background blur/redaction */}
                              {detection.blurred && (
                                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm group-hover:bg-black/70 transition-all" />
                              )}

                              {/* Replacement text overlay */}
                              {hasReplacement && detection.blurred && (
                                <div
                                  className="absolute inset-0 bg-white flex items-center px-0.5 overflow-visible"
                                  style={{
                                    fontSize: `${detection.style.font_size * scale}px`,
                                    lineHeight: `${detection.bbox.height * scale}px`,
                                    fontFamily: detection.style.font_name.includes('Bold')
                                      ? 'sans-serif'
                                      : 'sans-serif',
                                    fontWeight: detection.style.flags & 16 ? 'bold' : 'normal',
                                    fontStyle: detection.style.flags & 2 ? 'italic' : 'normal',
                                    color: `rgb(${(detection.style.color >> 16) & 0xff}, ${(detection.style.color >> 8) & 0xff}, ${detection.style.color & 0xff})`,
                                  }}
                                >
                                  <span className="whitespace-nowrap">
                                    {detection.replacementText}
                                  </span>
                                </div>
                              )}

                              {/* Hover indicator when unblurred */}
                              {!detection.blurred && (
                                <div className="absolute inset-0 border-2 border-dashed border-primary/30 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <EyeOff className="w-4 h-4 text-primary/50" />
                                </div>
                              )}

                              {/* Hover icon when blurred with no replacement */}
                              {detection.blurred && !hasReplacement && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Manual Blur Regions */}
                        {currentPageManualBlurs.map((blur) => (
                          <div
                            key={blur.id}
                            className="absolute bg-black/90 backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-all group"
                            style={{
                              left: `${blur.bbox.x * scale}px`,
                              top: `${blur.bbox.y * scale}px`,
                              width: `${blur.bbox.width * scale}px`,
                              height: `${blur.bbox.height * scale}px`,
                              zIndex: 10,
                              pointerEvents: 'auto',
                            }}
                            onClick={() => handleRemoveManualBlur(blur.id)}
                            title="Click to remove"
                          >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ))}
                      </Document>
                    </div>
                  </div>
                </div>

                {/* Help Text */}
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Click on any blurred area to toggle visibility • Use the sidebar to
                  control individual fields
                </p>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Share Link Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Anonymized Resume</DialogTitle>
            <DialogDescription>
              Anyone with this link can view your anonymized resume. They cannot edit it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
            />
            <Button
              size="sm"
              className="px-3"
              onClick={handleCopyLink}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            This link will work as long as the session exists.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
