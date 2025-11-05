import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, FileText } from 'lucide-react';
import { usePDFViewer } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetSharedSessionQuery } from '@/features/anonymizer/anonymizerService';
import type { PIIDetectionWithBlur } from '@/features/anonymizer/anonymizerTypes';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function ShareView() {
  const { token } = useParams<{ token: string }>();
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { currentPage, setCurrentPage, scale, numPages, setNumPages, nextPage, prevPage, canGoNext, canGoPrev } = usePDFViewer(1.5);

  const { data: sessionData, isLoading, error } = useGetSharedSessionQuery(token || '', {
    skip: !token,
  });

  // Load PDF when session data is available
  useEffect(() => {
    if (sessionData?.success && sessionData.session) {
      const session = sessionData.session;

      // Fetch PDF
      fetch(session.original_url)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], session.filename, { type: 'application/pdf' });
          setPdfFile(file);
          setNumPages(session.num_pages);
        })
        .catch((error) => {
          console.error('Failed to load PDF:', error);
        });
    }
  }, [sessionData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation unauthenticatedCtaText="Anonymize your resume" />
        <div className="flex items-center justify-center pt-32">
          <Card className="p-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary animate-spin" />
            <h2 className="text-2xl font-semibold mb-3">Loading Shared Resume...</h2>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !sessionData?.success) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation unauthenticatedCtaText="Anonymize your resume" />
        <div className="flex items-center justify-center pt-32">
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-3">Link Invalid or Expired</h2>
            <p className="text-muted-foreground">
              This share link is no longer valid. Please request a new link from the owner.
            </p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pdfFile || !sessionData.session) {
    return null;
  }

  const detections = sessionData.session.detections;
  const manualBlurs = sessionData.session.manual_blurs || [];
  const currentPageDetections = detections.filter((d: PIIDetectionWithBlur) => d.page === currentPage - 1);
  const currentPageManualBlurs = manualBlurs.filter((b) => b.page === currentPage - 1);

  return (
    <div className="min-h-screen bg-background">
      <Navigation unauthenticatedCtaText="Anonymize your resume" />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-6">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">{sessionData.session.filename}</h1>
            <p className="text-sm text-muted-foreground">Shared Anonymized Resume (Read-Only)</p>
          </div>
        </div>
        <Card className="p-6">
          {/* Toolbar */}
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === numPages}
                onClick={() => setCurrentPage(currentPage + 1)}
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
                onClick={() => setScale(Math.max(0.5, scale - 0.25))}
              >
                -
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(Math.min(3, scale + 0.25))}
              >
                +
              </Button>
            </div>
          </div>

          {/* PDF Viewer with Blur Overlays (Read-Only) */}
          <div className="border-2 rounded-lg overflow-auto max-h-[800px] bg-gray-100 relative">
            <div className="flex justify-center p-4">
              <div
                ref={pdfContainerRef}
                className="relative inline-block"
                style={{ userSelect: 'none' }}
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
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />

                  {/* Blur Overlays and Replacement Text (Read-Only) */}
                  {currentPageDetections.map((detection: PIIDetectionWithBlur) => {
                    const hasReplacement = detection.replacementText && detection.replacementText.trim();

                    return (
                      <div
                        key={detection.id || `${detection.page}-${detection.type}-${detection.bbox.x}-${detection.bbox.y}`}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${detection.bbox.x * scale}px`,
                          top: `${detection.bbox.y * scale}px`,
                          width: `${detection.bbox.width * scale}px`,
                          height: `${detection.bbox.height * scale}px`,
                          zIndex: 10,
                        }}
                      >
                        {/* Background blur/redaction */}
                        {detection.blurred && (
                          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                        )}

                        {/* Replacement text overlay */}
                        {hasReplacement && detection.blurred && (
                          <div
                            className="absolute inset-0 bg-white flex items-center px-0.5"
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
                            <span className="truncate w-full">
                              {detection.replacementText}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Manual Blur Regions (Read-Only) */}
                  {currentPageManualBlurs.map((blur) => (
                    <div
                      key={blur.id}
                      className="absolute bg-black/90 backdrop-blur-sm pointer-events-none"
                      style={{
                        left: `${blur.bbox.x * scale}px`,
                        top: `${blur.bbox.y * scale}px`,
                        width: `${blur.bbox.width * scale}px`,
                        height: `${blur.bbox.height * scale}px`,
                        zIndex: 10,
                      }}
                    />
                  ))}
                </Document>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <p className="text-sm text-gray-500 mt-4 text-center">
            This is a read-only view. All personal information has been anonymized.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
