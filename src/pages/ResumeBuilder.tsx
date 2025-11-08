import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import JobEntry from '@/components/EditorJSBlocks/JobEntry';
import { Save, Eye, Download, Loader2 } from 'lucide-react';
import {
  useCreateResumeBuilderMutation,
  useGetResumeBuilderQuery,
  useSaveResumeBuilderMutation,
  useGenerateResumePdfMutation,
} from '@/features/user-resume/userResumeService';

const ResumeBuilder = () => {
  const { isPro, isLoadingSubscription } = useAuthState();
  const { requireAuth } = useRequireAuth();
  const [searchParams] = useSearchParams();
  const editorRef = useRef<EditorJS | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const resumeIdFromUrl = searchParams.get('id');
  const [resumeId, setResumeId] = useState<string | null>(resumeIdFromUrl);

  // API Hooks
  const [createResume] = useCreateResumeBuilderMutation();
  const [saveResume] = useSaveResumeBuilderMutation();
  const [generatePdf, { isLoading: isGeneratingPdf }] = useGenerateResumePdfMutation();

  // Load existing resume if ID is provided
  const { data: existingResumeData, isLoading: isLoadingResume } = useGetResumeBuilderQuery(
    resumeIdFromUrl || '',
    {
      skip: !resumeIdFromUrl,
    }
  );

  useEffect(() => {
    if (!requireAuth()) return;

    // Wait for resume data to load if we're loading an existing resume
    if (resumeIdFromUrl && isLoadingResume) return;

    // Initialize Editor.js
    if (!editorRef.current) {
      // Use existing resume data if available, otherwise use default template
      const defaultData: OutputData = {
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
          // Job 1
          {
            type: 'jobEntry',
            data: {
              title: 'Job Title - Company Name',
              date: 'Date Range',
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
          // Job 2
          {
            type: 'jobEntry',
            data: {
              title: 'Job Title - Company Name',
              date: 'Date Range',
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
              text: 'Projects',
              level: 2,
            },
          },
          // Project 1
          {
            type: 'jobEntry',
            data: {
              title: 'Project Name',
              date: 'Date Range',
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
          // Project 2
          {
            type: 'jobEntry',
            data: {
              title: 'Project Name',
              date: 'Date Range',
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
      };

      const editorData = existingResumeData?.resume?.builder_content || defaultData;

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
          jobEntry: {
            class: JobEntry,
          },
          underline: Underline,
          delimiter: Delimiter,
        },
        data: editorData,
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
  }, [requireAuth, resumeIdFromUrl, isLoadingResume, existingResumeData]);

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
        /* Global Editor.js styles for resume formatting */
        .codex-editor__redactor {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
        }

        /* All text elements */
        .ce-paragraph,
        .ce-header,
        .cdx-list {
          font-size: 0.875rem !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
          text-align: left !important;
        }

        /* Name/Title - Level 1 Header */
        .ce-header[data-level="1"] {
          font-weight: 700 !important;
          margin-bottom: 0.25rem !important;
          margin-top: 0 !important;
        }

        /* Section Headers - Level 2 Header */
        .ce-header[data-level="2"] {
          font-weight: 700 !important;
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }

        /* Underline for section headers */
        .ce-block .ce-header[data-level="2"] {
          border-bottom: 2px solid #000 !important;
          padding-bottom: 0.125rem !important;
        }

        /* Job Title/Subsection - Level 3 Header */
        .ce-header[data-level="3"] {
          font-weight: 600 !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.125rem !important;
          overflow: hidden !important;
        }

        /* Paragraphs */
        .ce-paragraph {
          margin-top: 0.125rem !important;
          margin-bottom: 0.125rem !important;
        }

        /* Lists */
        .cdx-list {
          padding-left: 1.25rem !important;
          margin: 0.125rem 0 !important;
        }

        .cdx-list__item {
          margin-bottom: 0.125rem !important;
          padding: 0 !important;
        }

        /* Delimiter - style as horizontal line instead of *** */
        .ce-delimiter {
          margin: 0 !important;
          padding: 0 !important;
          line-height: 0 !important;
          text-align: center !important;
          position: relative !important;
          color: transparent !important;
        }

        .ce-delimiter::before {
          content: '' !important;
          display: block !important;
          border-top: 1px solid #d1d5db !important;
          width: 100% !important;
        }

        .ce-delimiter .ce-delimiter__content {
          display: none !important;
        }

        /* Remove spacing from delimiter block wrapper */
        .ce-block--delimiter {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }

        /* Remove top spacing from blocks following delimiter */
        .ce-block--delimiter + .ce-block {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }

        /* Job Entry block spacing */
        .job-entry-block {
          margin: 0 !important;
          padding: 0 !important;
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
          <div className="flex gap-2 items-center">
            <button
              onClick={handlePreview}
              disabled={!isReady}
              title={showPreview ? 'Hide Preview' : 'Preview'}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              disabled={!isReady || isGeneratingPdf}
              title="Export PDF"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
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
