import { useEffect, useRef, useState } from 'react';
import { useAuthState, useRequireAuth } from '@/hooks';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Underline from '@editorjs/underline';
import Delimiter from '@editorjs/delimiter';
import { Save, Eye, Download, Loader2 } from 'lucide-react';
import {
  useCreateResumeBuilderMutation,
  useSaveResumeBuilderMutation,
  useGenerateResumePdfMutation,
} from '@/features/user-resume/userResumeService';

const ResumeBuilder = () => {
  const { isPro, isLoadingSubscription } = useAuthState();
  const { requireAuth } = useRequireAuth();
  const editorRef = useRef<EditorJS | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);

  // API Hooks
  const [createResume] = useCreateResumeBuilderMutation();
  const [saveResume] = useSaveResumeBuilderMutation();
  const [generatePdf, { isLoading: isGeneratingPdf }] = useGenerateResumePdfMutation();

  useEffect(() => {
    if (!requireAuth()) return;

    // Initialize Editor.js
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        placeholder: 'Start building your resume...',
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [1, 2, 3],
              defaultLevel: 2,
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered',
            },
          },
          underline: Underline,
          delimiter: Delimiter,
        },
        data: {
          blocks: [
            {
              type: 'header',
              data: {
                text: 'Your Name',
                level: 1,
              },
            },
            {
              type: 'paragraph',
              data: {
                text: 'Email: your.email@example.com | Phone: (123) 456-7890 | Location: City, State',
              },
            },
            {
              type: 'delimiter',
              data: {},
            },
            {
              type: 'header',
              data: {
                text: 'Experience',
                level: 2,
              },
            },
            {
              type: 'header',
              data: {
                text: 'Job Title - Company Name',
                level: 3,
              },
            },
            {
              type: 'paragraph',
              data: {
                text: 'Date Range',
              },
            },
            {
              type: 'list',
              data: {
                style: 'unordered',
                items: [
                  'Achievement or responsibility 1',
                  'Achievement or responsibility 2',
                  'Achievement or responsibility 3',
                ],
              },
            },
            {
              type: 'header',
              data: {
                text: 'Education',
                level: 2,
              },
            },
            {
              type: 'paragraph',
              data: {
                text: 'Degree - University Name | Graduation Year',
              },
            },
            {
              type: 'header',
              data: {
                text: 'Skills',
                level: 2,
              },
            },
            {
              type: 'list',
              data: {
                style: 'unordered',
                items: [
                  'Skill 1',
                  'Skill 2',
                  'Skill 3',
                ],
              },
            },
          ],
        },
        onReady: () => {
          setIsReady(true);
        },
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [requireAuth]);

  const handleSave = async () => {
    if (!editorRef.current) return;

    setIsSaving(true);
    try {
      const outputData = await editorRef.current.save();

      // Extract title from first header block
      const firstBlock = outputData.blocks[0];
      const title = firstBlock?.type === 'header' ? firstBlock.data.text : 'Untitled Resume';

      let currentResumeId = resumeId;

      // Lazy creation: create resume on first save if it doesn't exist
      if (!currentResumeId) {
        const createResult = await createResume({ title }).unwrap();
        currentResumeId = createResult.resume_id;
        setResumeId(currentResumeId);
      }

      // Save the resume
      await saveResume({
        resumeId: currentResumeId,
        data: {
          editor_data: outputData,
          title: title,
        },
      }).unwrap();
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleExport = async () => {
    if (!editorRef.current) return;

    try {
      const outputData = await editorRef.current.save();

      // Extract title from first header block
      const firstBlock = outputData.blocks[0];
      const title = firstBlock?.type === 'header' ? firstBlock.data.text : 'Untitled Resume';

      let currentResumeId = resumeId;

      // Create resume if it doesn't exist
      if (!currentResumeId) {
        const createResult = await createResume({ title }).unwrap();
        currentResumeId = createResult.resume_id;
        setResumeId(currentResumeId);
      }

      // Auto-save before generating PDF
      await saveResume({
        resumeId: currentResumeId,
        data: {
          editor_data: outputData,
          title: title,
        },
      }).unwrap();

      // Generate PDF
      const result = await generatePdf(currentResumeId).unwrap();

      // Download the PDF
      const link = document.createElement('a');
      link.href = result.file_url;
      link.download = `${title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting resume:', error);
    }
  };

  return (
    <DashboardLayout isPro={isPro} isLoadingSubscription={isLoadingSubscription}>
      <style>{`
        /* Editor.js custom styles for resume formatting */
        .ce-paragraph,
        .ce-header,
        .cdx-list {
          text-align: left !important;
        }
        .ce-header[data-level="1"] {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .ce-header[data-level="2"] {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .ce-header[data-level="3"] {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
        }
        .cdx-list {
          padding-left: 1.5rem;
        }
        /* Delimiter - style as horizontal line instead of *** */
        .ce-delimiter {
          margin: 1.5rem 0;
          line-height: 0;
          text-align: center;
          position: relative;
          color: transparent;
        }
        .ce-delimiter::before {
          content: '';
          display: block;
          border-top: 1px solid #d1d5db;
          width: 100%;
        }
        .ce-delimiter .ce-delimiter__content {
          display: none;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
            <p className="text-muted-foreground">
              Create your professional resume
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              disabled={!isReady}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!isReady || isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isReady || isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Editor Container */}
        <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Editor */}
          <Card className="p-8">
            <div
              id="editorjs"
              className="max-w-none min-h-[800px]"
              style={{ textAlign: 'left' }}
            />
          </Card>

          {/* Preview Panel */}
          {showPreview && (
            <Card className="p-8 bg-white">
              <div className="mb-4 border-b pb-2">
                <h3 className="font-semibold">Live Preview</h3>
                <p className="text-xs text-muted-foreground">
                  This is how your resume will look
                </p>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm text-muted-foreground">
                  Preview will be rendered here...
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;
