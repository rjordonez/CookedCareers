import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadClick: () => void;
  mode?: 'upload' | 'update';
}

const UploadResumeModal = ({ isOpen, onClose, onUploadClick, mode = 'upload' }: UploadResumeModalProps) => {
  const handleUploadClick = () => {
    onClose();
    // Small delay to ensure modal closes before file dialog opens
    setTimeout(() => {
      onUploadClick();
    }, 100);
  };

  const isUpdateMode = mode === 'update';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center py-6 px-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>

          <DialogTitle className="text-2xl font-bold mb-3">
            {isUpdateMode ? 'Update Your Resume' : 'Upload Your Resume'}
          </DialogTitle>

          <DialogDescription className="text-muted-foreground mb-6">
            {isUpdateMode
              ? 'Replace your current resume with a new version. This will update the resume used for comparisons.'
              : 'To compare your resume with others, you need to upload your resume first. Click the button below to select your resume file.'}
          </DialogDescription>

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadClick}
              className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUpdateMode ? 'Update Resume' : 'Upload Resume'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Supported format: PDF only
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadResumeModal;
