import { FileText, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useListSessionsQuery } from '@/features/anonymizer/anonymizerService';
import type { SessionSummary } from '@/features/anonymizer/anonymizerTypes';

interface SessionsListProps {
  onSelectSession: (sessionId: string) => void;
  onUploadNew: () => void;
  authReady: boolean;
  isSignedIn: boolean;
}

export default function SessionsList({ onSelectSession, onUploadNew, authReady, isSignedIn }: SessionsListProps) {
  const { data, isLoading, error } = useListSessionsQuery(undefined, {
    skip: !authReady || !isSignedIn,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600">Failed to load sessions. Please try again.</p>
      </Card>
    );
  }

  const sessions = data?.sessions || [];

  return (
    <div className="space-y-6">
      {/* Upload New Button */}
      <Card className="p-6 text-center border-2 border-dashed border-border hover:border-primary/50 transition-colors">
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Upload New Resume</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a new PDF to anonymize
        </p>
        <Button onClick={onUploadNew}>
          <FileText className="w-4 h-4 mr-2" />
          Choose PDF File
        </Button>
      </Card>

      {/* Sessions List */}
      {sessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Saved Resumes</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session: SessionSummary) => (
              <Card
                key={session.session_id}
                className="p-4 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => onSelectSession(session.session_id)}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate mb-1">{session.filename}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.num_pages} {session.num_pages === 1 ? 'page' : 'pages'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last edited: {new Date(session.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  Click to edit
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No saved resumes yet. Upload your first PDF to get started!
          </p>
        </Card>
      )}
    </div>
  );
}
