import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Resume } from "@/features/resumes/resumeTypes";
import { Download, Mail, Phone, MapPin, Building, GraduationCap, Briefcase, Code, Award, ExternalLink, Crown } from "lucide-react";
import { UpgradeButton } from "./UpgradeButton";

interface ResumeDetailModalProps {
  resume: Resume | null;
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
}

export const ResumeDetailModal = ({ resume, isOpen, onClose, isPremium }: ResumeDetailModalProps) => {
  if (!resume) return null;

  const handleDownload = () => {
    if (resume.file_url) {
      window.open(resume.file_url, '_blank');
    }
  };

  const ContactInfo = () => {
    if (!isPremium) {
      return (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
          <Crown className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h4 className="font-semibold mb-2">Contact Info - Pro Only</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Upgrade to access email, phone, and other contact details for just $4.99/month
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
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">
                {resume.name || resume.title || 'Resume Details'}
              </DialogTitle>
              {resume.title && (
                <p className="text-muted-foreground">{resume.title}</p>
              )}
            </div>
            <Button onClick={handleDownload} disabled={!resume.file_url}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] px-6 pb-6">
          <div className="space-y-6">
            {/* Contact Info */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <ContactInfo />
            </section>

            <Separator />

            {/* Summary */}
            {(resume.company || resume.seniority || resume.years_of_experience !== undefined) && (
              <>
                <section>
                  <h3 className="text-lg font-semibold mb-3">Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resume.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Current Company</p>
                          <p className="font-medium">{resume.company}</p>
                        </div>
                      </div>
                    )}
                    {resume.seniority && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Seniority</p>
                        <Badge variant="secondary" className="capitalize">{resume.seniority}</Badge>
                      </div>
                    )}
                    {resume.years_of_experience !== undefined && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Experience</p>
                        <p className="font-medium">{resume.years_of_experience} years</p>
                      </div>
                    )}
                  </div>
                </section>
                <Separator />
              </>
            )}

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
      </DialogContent>
    </Dialog>
  );
};
