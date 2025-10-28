import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock } from "lucide-react";
import type { Resume } from "@/features/resumes/resumeTypes";

interface PaywallCardProps {
  resume: Resume;
  onUpgrade: () => void;
}

export const PaywallCard = ({ resume, onUpgrade }: PaywallCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20 p-6 transition-all hover:border-primary/40">
      {/* Blurred Content */}
      <div className="pointer-events-none blur-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">{resume.name || "Resume"}</h3>
            <p className="text-sm text-muted-foreground">
              {resume.title || "Position"}
              {resume.company && ` at ${resume.company}`}
            </p>
          </div>
          {resume.seniority && (
            <Badge variant="secondary" className="capitalize">
              {resume.seniority}
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {resume.email && (
            <p className="flex items-center gap-2">
              <span className="font-medium">Email:</span> {resume.email}
            </p>
          )}
          {resume.location && (
            <p className="flex items-center gap-2">
              <span className="font-medium">Location:</span> {resume.location}
            </p>
          )}
          {resume.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {resume.skills.slice(0, 6).map((skill, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="text-center space-y-4 px-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Crown className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              Upgrade to Pro
            </h4>
            <p className="text-sm text-muted-foreground mt-2">
              Unlock unlimited resume access for just <span className="font-bold text-primary">$9.99/month</span>
            </p>
          </div>

          <Button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            size="lg"
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade Now
          </Button>
        </div>
      </div>
    </Card>
  );
};
