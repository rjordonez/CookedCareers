/**
 * Shared Resume Styles - Single source of truth for both editor preview and PDF export
 */

export const resumeStyles = `
  @page {
    size: Letter;
    margin: 0.75in;
  }

  * {
    box-sizing: border-box;
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
  h1, .ce-header[data-level="1"] {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.25rem 0;
    text-align: left;
  }

  /* Section Headers - Level 2 Header */
  h2, .ce-header[data-level="2"] {
    font-size: 0.875rem;
    font-weight: 700;
    margin: 0.25rem 0 0.25rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #000;
    padding-bottom: 0.125rem;
  }

  /* Job Title/Subsection - Level 3 Header */
  h3, .ce-header[data-level="3"] {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0.5rem 0 0.125rem 0;
  }

  /* Paragraphs */
  p, .ce-paragraph {
    margin: 0.125rem 0;
    font-size: 0.875rem;
  }

  /* Lists */
  ul, ol, .cdx-list {
    padding-left: 1.25rem;
    margin: 0.125rem 0;
    font-size: 0.875rem;
  }

  li, .cdx-list__item {
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
  hr, .ce-delimiter {
    border: none;
    border-top: 1px solid #d1d5db;
    margin: 0;
    padding: 0;
    line-height: 0;
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

  /* Job Entry block - title on left, date on right */
  .job-entry, .job-entry-block > div {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 0.5rem;
    margin-bottom: 0.125rem;
  }

  .job-entry strong, .job-entry-block > div > div:first-child {
    font-weight: 600;
    font-size: 0.875rem;
    flex: 1;
  }

  .job-entry span, .job-entry-block > div > div:last-child {
    font-size: 0.875rem;
    margin-left: 1rem;
    text-align: right;
  }
`;

/**
 * Editor-specific styles that only apply to the Editor.js UI
 * These handle contentEditable and Editor.js-specific classes
 */
export const editorSpecificStyles = `
  .codex-editor__redactor {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
  }

  .ce-paragraph,
  .ce-header,
  .cdx-list {
    font-size: 0.875rem !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
    text-align: left !important;
  }

  .ce-header[data-level="1"] {
    font-weight: 700 !important;
    margin-bottom: 0.25rem !important;
    margin-top: 0 !important;
  }

  .ce-header[data-level="2"] {
    font-weight: 700 !important;
    margin-top: 0.25rem !important;
    margin-bottom: 0.25rem !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    border-bottom: 2px solid #000 !important;
    padding-bottom: 0.125rem !important;
  }

  .ce-header[data-level="3"] {
    font-weight: 600 !important;
    margin-top: 0.5rem !important;
    margin-bottom: 0.125rem !important;
    overflow: hidden !important;
  }

  .ce-paragraph {
    margin-top: 0.125rem !important;
    margin-bottom: 0.125rem !important;
  }

  .cdx-list {
    padding-left: 1.25rem !important;
    margin: 0.125rem 0 !important;
  }

  .cdx-list__item {
    margin-bottom: 0.125rem !important;
    padding: 0 !important;
  }

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

  .ce-block--delimiter {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }

  .ce-block--delimiter + .ce-block {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .job-entry-block {
    margin: 0 !important;
    padding: 0 !important;
  }

  .job-entry-block > div {
    display: flex !important;
    justify-content: space-between !important;
    align-items: baseline !important;
    margin-top: 0.5rem !important;
    margin-bottom: 0.125rem !important;
  }

  .job-entry-block > div > div:first-child {
    font-weight: 600 !important;
    font-size: 0.875rem !important;
    flex: 1 !important;
  }

  .job-entry-block > div > div:last-child {
    font-size: 0.875rem !important;
    margin-left: 1rem !important;
    text-align: right !important;
  }
`;

/**
 * Get combined styles for editor preview
 */
export function getEditorStyles(): string {
  return resumeStyles + editorSpecificStyles;
}

/**
 * Wrap HTML content with the shared resume styles for PDF export
 */
export function wrapWithResumeStyles(htmlContent: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${resumeStyles}
    ${editorSpecificStyles}
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
  `.trim();
}
