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
          // Header
          {
            type: 'header',
            data: {
              text: 'Your Resume',
              level: 1,
            },
          },
          {
            type: 'paragraph',
            data: {
              text: '123-456-7890 | jake@su.edu | linkedin.com/in/jake | github.com/jake',
            },
          },
          // Education
          {
            type: 'header',
            data: {
              text: 'Education',
              level: 2,
            },
          },
          {
            type: 'jobEntry',
            data: {
              title: 'Southwestern University',
              date: 'Georgetown, TX',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: '<i>Bachelor of Arts in Computer Science, Minor in Business</i> | Aug. 2018 - May 2021',
            },
          },
          {
            type: 'jobEntry',
            data: {
              title: 'Blinn College',
              date: 'Bryan, TX',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: "<i>Associate's in Liberal Arts</i> | Aug. 2014 - May 2018",
            },
          },
          // Experience
          {
            type: 'header',
            data: {
              text: 'Experience',
              level: 2,
            },
          },
          {
            type: 'jobEntry',
            data: {
              title: 'Undergraduate Research Assistant - Texas A&M University',
              date: 'June 2020 - Present',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: '<i>College Station, TX</i>',
            },
          },
          {
            type: 'list',
            data: {
              style: 'unordered',
              items: [
                'Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems',
                'Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data',
                'Explored ways to visualize GitHub collaboration in a classroom setting',
              ],
            },
          },
          {
            type: 'jobEntry',
            data: {
              title: 'Information Technology Support Specialist - Southwestern University',
              date: 'Sep. 2018 - Present',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: '<i>Georgetown, TX</i>',
            },
          },
          {
            type: 'list',
            data: {
              style: 'unordered',
              items: [
                'Communicate with managers to set up campus computers used on campus',
                'Assess and troubleshoot computer problems brought by students, faculty and staff',
                'Maintain upkeep of computers, classroom equipment, and 200 printers across campus',
              ],
            },
          },
          {
            type: 'jobEntry',
            data: {
              title: 'Artificial Intelligence Research Assistant - Southwestern University',
              date: 'May 2019 - July 2019',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: '<i>Georgetown, TX</i>',
            },
          },
          {
            type: 'list',
            data: {
              style: 'unordered',
              items: [
                'Explored methods to generate video game dungeons based off of The Legend of Zelda',
                'Developed a game in Java to test the generated dungeons',
                'Contributed 50K+ lines of code to an established codebase via Git',
                'Conducted a human subject study to determine which video game dungeon generation technique is enjoyable',
                'Wrote an 8-page paper and gave multiple presentations on-campus',
                'Presented virtually to the World Conference on Computational Intelligence',
              ],
            },
          },
          // Projects
          {
            type: 'header',
            data: {
              text: 'Projects',
              level: 2,
            },
          },
          {
            type: 'jobEntry',
            data: {
              title: 'Gitlytics | Python, Flask, React, PostgreSQL, Docker',
              date: 'June 2020 - Present',
            },
          },
          {
            type: 'list',
            data: {
              style: 'unordered',
              items: [
                'Developed a full-stack web application using with Flask serving a REST API with React as the frontend',
                "Implemented GitHub OAuth to get data from user's repositories",
                'Visualized GitHub data to show collaboration',
                'Used Celery and Redis for asynchronous tasks',
              ],
            },
          },
          {
            type: 'jobEntry',
            data: {
              title: 'Simple Paintball | Spigot API, Java, Maven, TravisCI, Git',
              date: 'May 2018 - May 2020',
            },
          },
          {
            type: 'list',
            data: {
              style: 'unordered',
              items: [
                'Developed a Minecraft server plugin to entertain kids during free time for a previous job',
                'Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review',
                'Implemented continuous delivery using TravisCI to build the plugin upon new a release',
                'Collaborated with Minecraft server administrators to suggest features and get feedback about the plugin',
              ],
            },
          },
          // Technical Skills
          {
            type: 'header',
            data: {
              text: 'Technical Skills',
              level: 2,
            },
          },
          {
            type: 'paragraph',
            data: {
              text: '<b>Languages:</b> Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: '<b>Frameworks:</b> React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: '<b>Developer Tools:</b> Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual Studio, PyCharm, IntelliJ, Eclipse',
            },
          },
          {
            type: 'paragraph',
            data: {
              text: '<b>Libraries:</b> pandas, NumPy, Matplotlib',
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

      // Wrap content in #editorjs div so scoped styles apply, then wrap with PDF styles
      const htmlWithWrapper = `<div id="editorjs">${clonedContent.innerHTML}</div>`;
      const styledHTML = wrapWithResumeStyles(htmlWithWrapper);

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

        {/* Editor Container - Letter size page */}
        <div className="flex justify-center">
          <Card
            className="px-6 shadow-lg"
            style={{
              width: '816px',
              paddingTop: '24px',
              paddingBottom: '24px',
            }}
          >
            <div
              id="editorjs"
              className="max-w-none"
              style={{
                textAlign: 'left',
              }}
            />
          </Card>
        </div>
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
