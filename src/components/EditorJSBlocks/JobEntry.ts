/**
 * Job Entry Block for Editor.js
 * Displays job title on left and date range on right in the same line
 */

interface JobEntryData {
  title: string;
  date: string;
}

export default class JobEntry {
  private api: any;
  private readOnly: boolean;
  private data: JobEntryData;
  private wrapper: HTMLElement | undefined;

  static get toolbox() {
    return {
      title: 'Job Entry',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  constructor({ data, api, readOnly }: { data: JobEntryData; api: any; readOnly: boolean }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      title: data.title || 'Job Title - Company Name',
      date: data.date || 'Date Range',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('job-entry-block');

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'space-between';
    container.style.alignItems = 'baseline';
    container.style.marginTop = '0.5rem';
    container.style.marginBottom = '0.125rem';

    const titleInput = document.createElement('div');
    titleInput.contentEditable = (!this.readOnly).toString();
    titleInput.innerHTML = this.data.title;
    titleInput.style.fontWeight = '600';
    titleInput.style.fontSize = '0.875rem';
    titleInput.style.outline = 'none';
    titleInput.style.flex = '1';

    const dateInput = document.createElement('div');
    dateInput.contentEditable = (!this.readOnly).toString();
    dateInput.innerHTML = this.data.date;
    dateInput.style.fontSize = '0.875rem';
    dateInput.style.outline = 'none';
    dateInput.style.textAlign = 'right';
    dateInput.style.marginLeft = '1rem';

    // Update data on input
    titleInput.addEventListener('input', () => {
      this.data.title = titleInput.innerHTML;
    });

    dateInput.addEventListener('input', () => {
      this.data.date = dateInput.innerHTML;
    });

    container.appendChild(titleInput);
    container.appendChild(dateInput);
    this.wrapper.appendChild(container);

    return this.wrapper;
  }

  save() {
    return {
      title: this.data.title,
      date: this.data.date,
    };
  }

  static get sanitize() {
    return {
      title: {},
      date: {},
    };
  }
}
