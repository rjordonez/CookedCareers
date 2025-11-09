/**
 * Resume Renderer - Converts Editor.js blocks to styled HTML
 * This is the single source of truth for resume styling
 */

interface EditorBlock {
  type: string;
  data: any;
}

interface EditorData {
  blocks: EditorBlock[];
}

/**
 * Convert Editor.js data to a complete HTML document with styling
 */
export function renderResumeToHTML(editorData: EditorData): string {
  const blocks = editorData.blocks || [];
  const htmlBlocks = blocks.map(block => convertBlockToHTML(block));

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: Letter;
      margin: 1in;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      font-size: 0.875rem;
      line-height: 1.4;
      color: #000;
      margin: 0;
      padding: 0;
    }

    /* Name/Title - Level 1 Header */
    h1 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
      text-align: left;
    }

    /* Section Headers - Level 2 Header */
    h2 {
      font-size: 0.875rem;
      font-weight: 700;
      margin: 0.25rem 0 0.25rem 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #000;
      padding-bottom: 0.125rem;
    }

    /* Job Title/Subsection - Level 3 Header */
    h3 {
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0.5rem 0 0.125rem 0;
    }

    /* Paragraphs */
    p {
      margin: 0.125rem 0;
    }

    /* Lists */
    ul, ol {
      padding-left: 1.25rem;
      margin: 0.125rem 0;
    }

    li {
      margin-bottom: 0.125rem;
      padding: 0;
    }

    /* Bold and Italic */
    b, strong {
      font-weight: bold;
    }

    i, em {
      font-style: italic;
    }

    u {
      text-decoration: underline;
    }

    /* Delimiter - horizontal line */
    hr {
      border: none;
      border-top: 1px solid #d1d5db;
      margin: 0;
    }

    /* Job Entry block - title on left, date on right */
    .job-entry {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-top: 0.5rem;
      margin-bottom: 0.125rem;
    }

    .job-entry strong {
      font-weight: 600;
      font-size: 0.875rem;
      flex: 1;
    }

    .job-entry span {
      font-size: 0.875rem;
      margin-left: 1rem;
      text-align: right;
    }
  </style>
</head>
<body>
${htmlBlocks.join('\n')}
</body>
</html>
  `.trim();
}

/**
 * Convert a single Editor.js block to HTML
 */
function convertBlockToHTML(block: EditorBlock): string {
  const { type, data } = block;

  switch (type) {
    case 'header':
      const level = data.level || 2;
      const headerText = data.text || '';
      return `<h${level}>${headerText}</h${level}>`;

    case 'paragraph':
      const paragraphText = data.text || '';
      // Replace &nbsp; with regular spaces
      const cleanText = paragraphText.replace(/&nbsp;/g, ' ');
      return `<p>${cleanText}</p>`;

    case 'list':
      const style = data.style || 'unordered';
      const items = data.items || [];
      const tag = style === 'unordered' ? 'ul' : 'ol';

      const listItems = items.map((item: any) => {
        const content = typeof item === 'string' ? item : (item.content || '');
        return `  <li>${content}</li>`;
      }).join('\n');

      return `<${tag}>\n${listItems}\n</${tag}>`;

    case 'delimiter':
      return '<hr>';

    case 'jobEntry':
      const title = data.title || '';
      const date = data.date || '';
      return `<div class="job-entry">
  <strong>${title}</strong>
  <span>${date}</span>
</div>`;

    default:
      // Unknown block type - skip
      console.warn(`Unknown block type: ${type}`);
      return '';
  }
}
