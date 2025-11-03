import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Resume } from "@/features/resumes/resumeTypes";
import { Download, Mail, Phone, MapPin, Building, GraduationCap, Briefcase, Code, Award, ExternalLink, Crown, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { UpgradeButton } from "./UpgradeButton";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useState, useEffect } from 'react';

interface ResumeDetailModalProps {
  resume: Resume | null;
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
}

export const ResumeDetailModal = ({ resume, isOpen, onClose, isPremium }: ResumeDetailModalProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.55);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load PDF when resume changes
  useEffect(() => {
    if (resume?.file_url) {
      setIsLoading(true);
      setPdfFile(resume.file_url);
      setCurrentPage(1);
      setScale(1.55);
    } else {
      setPdfFile(null);
    }
  }, [resume?.file_url]);

  if (!resume) return null;

  const handleDownload = () => {
    if (resume.file_url) {
      window.open(resume.file_url, '_blank');
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

  const ContactInfo = () => {
    if (!isPremium) {
      return (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
          <Crown className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h4 className="font-semibold mb-2">Contact Info - Pro Only</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Upgrade to access email, phone, and other contact details for just $9.99/month
          </p>
          <UpgradeButton />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {resume.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a href={`mailto:${resume.email}`} className="hover:underline">
              {resume.email}
            </a>
          </div>
        )}
        {resume.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{resume.phone}</span>
          </div>
        )}
        {resume.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{resume.location}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 pr-14">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl mb-2 truncate">
                {resume.name || resume.title || 'Resume Details'}
              </DialogTitle>
              {resume.title && (
                <p className="text-muted-foreground truncate">{resume.title}</p>
              )}
            </div>
            <Button onClick={handleDownload} disabled={!resume.file_url} size="sm" className="shrink-0">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 px-6 pb-6 max-h-[calc(90vh-120px)]">
          {/* Left: PDF Preview */}
          {resume.file_url && (
            <div className="w-full md:w-2/3 flex flex-col gap-2 flex-shrink-0">
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
              <div className="h-[400px] md:h-[calc(90vh-220px)] bg-white rounded-lg overflow-auto border flex justify-center">
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
          )}

          {/* Right: Text Details */}
          <ScrollArea className="w-full md:w-1/3">
            <div className="pr-4">
            {/* Contact Info */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <ContactInfo />
            </section>

            <Separator />

            {/* Skills */}
            {resume.skills && resume.skills.length > 0 && (
              <>
                <section>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </section>
                <Separator />
              </>
            )}

            {/* Experience */}
            {resume.experience && resume.experience.length > 0 && (
              <>
                <section>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Experience
                  </h3>
                  <div className="space-y-4">
                    {resume.experience.map((exp, idx) => (
                      <div key={idx} className="border-l-2 border-primary/20 pl-4">
                        <h4 className="font-semibold">{exp.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{exp.company}</p>
                        {(exp.start_date || exp.end_date) && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {exp.start_date} - {exp.end_date || 'Present'}
                          </p>
                        )}
                        {exp.description && (
                          <p className="text-sm mt-2 whitespace-pre-line">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
                <Separator />
              </>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
              <>
                <section>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {resume.education.map((edu, idx) => (
                      <div key={idx} className="border-l-2 border-primary/20 pl-4">
                        <h4 className="font-semibold">{edu.institution}</h4>
                        {edu.degree && (
                          <p className="text-sm text-muted-foreground">
                            {edu.degree}
                            {edu.field_of_study && ` in ${edu.field_of_study}`}
                          </p>
                        )}
                        {edu.graduation_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Graduated: {edu.graduation_date}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
                <Separator />
              </>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <>
                <section>
                  <h3 className="text-lg font-semibold mb-3">Projects</h3>
                  <div className="space-y-4">
                    {resume.projects.map((project, idx) => (
                      <div key={idx} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold">{project.name}</h4>
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {project.description}
                          </p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.map((tech, techIdx) => (
                              <Badge key={techIdx} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
                <Separator />
              </>
            )}

            {/* Certifications */}
            {resume.certifications && resume.certifications.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certifications
                </h3>
                <div className="space-y-2">
                  {resume.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        {cert.issuer && (
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        )}
                        {cert.date && (
                          <p className="text-xs text-muted-foreground">{cert.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
