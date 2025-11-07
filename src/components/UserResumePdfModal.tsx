import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

interface UserResumePdfModalProps {
  resumeUrl: string | null;
  resumeFilename: string;
  isOpen: boolean;
  onClose: () => void;
}

export const UserResumePdfModal = ({ resumeUrl, resumeFilename, isOpen, onClose }: UserResumePdfModalProps) => {
  const { getToken } = useAuth();
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.55);
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load PDF when resume URL changes - fetch with authentication
  useEffect(() => {
    const fetchPdf = async () => {
      if (resumeUrl) {
        setIsLoading(true);
        try {
          const token = await getToken();
          const response = await fetch(resumeUrl, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });

          if (!response.ok) {
            throw new Error(`Failed to load PDF: ${response.status}`);
          }

          const blob = await response.blob();
          setPdfFile(blob);
          setCurrentPage(1);
          setScale(1.55);
        } catch (error) {
          console.error('Error loading PDF:', error);
          setPdfFile(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setPdfFile(null);
        setIsLoading(false);
      }
    };

    fetchPdf();
  }, [resumeUrl, getToken]);

  const handleDownload = async () => {
    if (pdfFile) {
      const blobUrl = URL.createObjectURL(pdfFile);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = resumeFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(numPages, prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 pr-14">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl mb-2 truncate">
                {resumeFilename}
              </DialogTitle>
            </div>
            <Button onClick={handleDownload} disabled={!pdfFile || isLoading} size="sm" className="shrink-0">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-2 px-6 pb-6 max-h-[calc(90vh-120px)]">
          {/* PDF Controls */}
          <div className="flex items-center justify-between gap-2 bg-muted px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {numPages || '...'}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage >= numPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {Math.round(scale * 100)}%
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomIn}
                disabled={scale >= 3.0}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="h-[calc(90vh-220px)] bg-white rounded-lg overflow-auto border flex justify-center">
            {pdfFile && (
              <Document
                file={pdfFile}
                onLoadSuccess={({ numPages }) => {
                  setNumPages(numPages);
                  setIsLoading(false);
                }}
                onLoadError={(error) => {
                  console.error('Error loading PDF:', error);
                  setIsLoading(false);
                }}
                loading={
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading PDF...</p>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-full">
                    <p className="text-destructive">Failed to load PDF</p>
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
