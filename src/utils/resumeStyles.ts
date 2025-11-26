/**
 * Shared Resume Styles - Single source of truth for both editor preview and PDF export
 */

export const resumeStyles = `
  @page {
    size: Letter;
    margin: 0.25in 0;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 0.875rem;
    line-height: 1.4;
    color: #000;
    margin: 0;
    padding: 0 1.5rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Editor.js block wrappers - remove default spacing */
  .ce-block {
    padding: 0;
    margin: 0;
  }

  .ce-block__content {
    max-width: 100%;
    margin: 0;
  }

  .codex-editor__redactor {
    padding: 0;
  }

  /* Name/Title - Level 1 Header */
  h1, .ce-header[data-level="1"] {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.25rem 0;
    padding: 0;
    text-align: left;
  }

  /* Section Headers - Level 2 Header */
  h2, .ce-header[data-level="2"] {
    font-size: 0.875rem;
    font-weight: 700;
    margin: 0.25rem 0 0.25rem 0;
    padding: 0;
    padding-bottom: 0.125rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #000;
  }

  /* Job Title/Subsection - Level 3 Header */
  h3, .ce-header[data-level="3"] {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0.5rem 0 0.125rem 0;
    padding: 0;
  }

  /* Paragraphs */
  p, .ce-paragraph {
    margin: 0.125rem 0;
    padding: 0;
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

  .ce-block--delimiter {
    margin: 0;
    padding: 0;
  }

  .ce-block--delimiter + .ce-block {
    margin-top: 0;
    padding-top: 0;
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

  .job-entry-block {
    margin: 0;
    padding: 0;
  }
`;

/**
 * Editor-specific styles that only apply to the Editor.js UI
 * These handle contentEditable and Editor.js-specific classes
 * All styles scoped to #editorjs to isolate from app global styles
 */
export const editorSpecificStyles = `
  /* Reset global styles within the editor */
  #editorjs {
    all: initial;
    display: block;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 0.875rem;
    line-height: 1.4;
    color: #000;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #editorjs * {
    box-sizing: border-box;
  }

  #editorjs .codex-editor__redactor {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-bottom: 0 !important;
    min-height: auto !important;
  }

  #editorjs .codex-editor {
    min-height: auto !important;
  }

  #editorjs .codex-editor__redactor::after {
    display: none !important;
  }

  #editorjs .ce-block__content {
    max-width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  #editorjs .ce-toolbar__content {
    max-width: 100% !important;
  }

  #editorjs .ce-paragraph,
  #editorjs .ce-header,
  #editorjs .cdx-list {
    font-size: 0.875rem !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
    text-align: left !important;
  }

  #editorjs .ce-header[data-level="1"] {
    font-size: 1.25rem !important;
    font-weight: 700 !important;
    margin: 0 0 0.25rem 0 !important;
    padding: 0 !important;
  }

  #editorjs .ce-header[data-level="2"] {
    font-size: 0.875rem !important;
    font-weight: 700 !important;
    margin: 0.25rem 0 !important;
    padding: 0 !important;
    padding-bottom: 0.125rem !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    border-bottom: 2px solid #000 !important;
  }

  #editorjs .ce-header[data-level="3"] {
    font-size: 0.875rem !important;
    font-weight: 600 !important;
    margin: 0.5rem 0 0.125rem 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  #editorjs .ce-paragraph {
    margin: 0.125rem 0 !important;
    padding: 0 !important;
    font-size: 0.875rem !important;
  }

  #editorjs .cdx-list {
    padding-left: 1.25rem !important;
    margin: 0.125rem 0 !important;
    font-size: 0.875rem !important;
  }

  #editorjs .cdx-list__item {
    margin-bottom: 0.125rem !important;
    padding: 0 !important;
  }

  #editorjs .ce-block {
    padding: 0 !important;
    margin: 0 !important;
  }

  #editorjs .ce-delimiter {
    margin: 0 !important;
    padding: 0 !important;
    line-height: 0 !important;
    text-align: center !important;
    position: relative !important;
    color: transparent !important;
  }

  #editorjs .ce-delimiter::before {
    content: '' !important;
    display: block !important;
    border-top: 1px solid #d1d5db !important;
    width: 100% !important;
  }

  #editorjs .ce-delimiter .ce-delimiter__content {
    display: none !important;
  }

  #editorjs .ce-block--delimiter {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }

  #editorjs .ce-block--delimiter + .ce-block {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  #editorjs .job-entry-block {
    margin: 0 !important;
    padding: 0 !important;
  }

  #editorjs .job-entry-block > div {
    display: flex !important;
    justify-content: space-between !important;
    align-items: baseline !important;
    margin-top: 0.5rem !important;
    margin-bottom: 0.125rem !important;
  }

  #editorjs .job-entry-block > div > div:first-child {
    font-weight: 600 !important;
    font-size: 0.875rem !important;
    flex: 1 !important;
  }

  #editorjs .job-entry-block > div > div:last-child {
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
 * Wrap HTML content with styles for PDF export
 * Uses the same styles as the builder so PDF matches exactly
 */
export function wrapWithResumeStyles(htmlContent: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* Set root font size to match the app */
    html {
      font-size: 16px;
    }
    ${resumeStyles}
    ${editorSpecificStyles}
    /* Ensure body padding applies for PDF */
    body {
      padding: 0 24px !important;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
  `.trim();
}
