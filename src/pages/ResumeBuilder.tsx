import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
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
import { Save, Download, Loader2, FileSearch } from 'lucide-react';
import {
  useCreateResumeBuilderMutation,
  useGetResumeBuilderQuery,
  useSaveResumeBuilderMutation,
  useGenerateResumePdfMutation,
} from '@/features/user-resume/userResumeService';
import { getEditorStyles, wrapWithResumeStyles } from '@/utils/resumeStyles';
import ATSCheckerSidebar, { type ATSData } from '@/components/ATSCheckerSidebar';

const ResumeBuilder = () => {
  const { isPro, isLoadingSubscription } = useAuthState();
  const { requireAuth } = useRequireAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const editorRef = useRef<EditorJS | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get ATS data from navigation state (when coming from ATS Checker page)
  const atsDataFromState = (location.state as { atsData?: ATSData } | null)?.atsData || null;
  const [isATSSidebarOpen, setIsATSSidebarOpen] = useState(!!atsDataFromState);

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

      // Capture the actual DOM from the editor (what the user sees)
      const editorElement = document.querySelector('#editorjs .codex-editor__redactor');
      if (!editorElement) {
        console.error('Could not find editor element');
        return;
      }

      // Clone the content to avoid modifying the original
      const clonedContent = editorElement.cloneNode(true) as HTMLElement;

      // Remove contenteditable attributes and editor-specific elements
      clonedContent.querySelectorAll('[contenteditable]').forEach(el => {
        el.removeAttribute('contenteditable');
      });

      // Remove any editor UI elements (like toolbars, placeholders)
      clonedContent.querySelectorAll('.ce-toolbar, .ce-inline-toolbar, .ce-placeholder').forEach(el => {
        el.remove();
      });

      // Wrap with shared styles for PDF generation
      const styledHTML = wrapWithResumeStyles(clonedContent.innerHTML);

      // Generate PDF from HTML (backend just converts HTML → PDF)
      const result = await generatePdf({
        resumeId: currentResumeId,
        html: styledHTML,
      }).unwrap();

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
      <style>{getEditorStyles()}</style>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsATSSidebarOpen(true)}
              disabled={!isReady}
            >
              <FileSearch className="w-4 h-4 mr-2" />
              ATS Check
            </Button>
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
        <Card className="p-8">
          <div
            id="editorjs"
            className="max-w-none min-h-[800px]"
            style={{ textAlign: 'left' }}
          />
        </Card>
      </div>

      {/* ATS Checker Sidebar */}
      <ATSCheckerSidebar
        isOpen={isATSSidebarOpen}
        onClose={() => setIsATSSidebarOpen(false)}
        resumeId={resumeId}
        initialData={atsDataFromState}
      />
    </DashboardLayout>
  );
};

export default ResumeBuilder;
