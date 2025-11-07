import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import { Loader2, FileText, Download, Plus } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useAuthState, useRequireAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUploadUserResumeMutation, useListUserResumesQuery } from '@/features/user-resume/userResumeService';
import DashboardLayout from '@/components/DashboardLayout';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { querySkipCondition, isPro, isLoadingSubscription } = useAuthState();
  const { requireAuth } = useRequireAuth();
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResume, { isLoading: isUploading }] = useUploadUserResumeMutation();
  const {
    data: resumesData,
    isLoading: isLoadingResumes,
    refetch,
  } = useListUserResumesQuery(undefined, {
    skip: querySkipCondition,
  });

  const resumes = resumesData?.resumes || [];

  const handleFileSelect = async (file: File) => {
    if (!requireAuth()) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadResume(formData).unwrap();
      if (result.success) {
        refetch(); // Refresh the resumes list
      } else {
        console.error('Failed to upload resume');
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

  const handleViewDetails = (resumeId: string) => {
    // Navigate to resume details or editor page
    navigate(`/resumes/${resumeId}`);
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
            className={`overflow-hidden border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-2 ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <div className="aspect-[253/320] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              {isUploading ? (
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-3 text-primary animate-spin" />
                  <p className="text-sm font-medium text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Upload Resume
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Drop PDF here or click
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 bg-background">
              <p className="text-xs text-center text-muted-foreground">
                Upload your resume for review
              </p>
            </div>
          </Card>

          {/* Resume Cards */}
          {isLoadingResumes ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden border-0 bg-muted rounded-2xl h-full animate-pulse">
                <div className="aspect-[253/320] bg-gradient-to-br from-gray-200 to-gray-300" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              </Card>
            ))
          ) : (
            resumes
              .filter((resume) => resume.file_type !== 'builder')
              .map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onView={handleViewDetails}
                  onDownload={handleDownload}
                  getToken={getToken}
                />
              ))
          )}
        </div>

        {resumes.filter((r) => r.file_type !== 'builder').length === 0 && !isLoadingResumes && (
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

// Resume Card Component
function ResumeCard({
  resume,
  onView,
  onDownload,
  getToken,
}: {
  resume: {
    id: string;
    filename: string;
    file_url: string;
    file_type: string | null;
    created_at: string;
    updated_at: string;
  };
  onView: (id: string) => void;
  onDownload: (url: string, filename: string) => void;
  getToken: () => Promise<string | null>;
}) {
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(true);

  // Fetch PDF with authentication
  useEffect(() => {
    const fetchPdf = async () => {
      setLoadingPdf(true);
      try {
        const token = await getToken();
        const pdfUrl = resume.file_url;

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
  }, [resume, getToken]);

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
        onClick={() => onView(resume.id)}
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
                </Document>
              </div>
            </div>
          )}
        </div>

        {/* Card Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-sm leading-tight truncate mb-1">
              {resume.filename}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatDate(resume.created_at)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(resume.file_url, resume.filename);
              }}
            >
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
