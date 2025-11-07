// User Resume API Types

export interface UserResume {
  id: string;
  user_id: string;
  filename: string;
  file_url: string;
  storage_path: string;
  file_type: string | null;
  raw_text: string | null;
  parsed_data: any | null;
  version: number;
  label: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserResumeItem {
  id: string;
  filename: string;
  file_url: string;
  file_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListUserResumesResponse {
  success: boolean;
  resumes: UserResume[];
}

export interface ListResumesResponse {
  success: boolean;
  resumes: UserResumeItem[];
}

export interface UploadResumeResponse {
  success: boolean;
  resume_id: string;
  file_url: string;
  version: number;
}

export interface DeleteResumeResponse {
  success: boolean;
  message: string;
}

export interface GetResumeHtmlResponse {
  success: boolean;
  html: string;
}

export interface ExportResumePdfRequest {
  html: string;
}

// Resume Builder Types
export interface ResumeBuilderContent {
  id: string;
  user_id: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  builder_content: any;
  created_at: string;
  updated_at: string;
}

export interface CreateResumeBuilderResponse {
  success: boolean;
  resume_id: string;
  message: string;
}

export interface GetResumeBuilderResponse {
  success: boolean;
  resume: ResumeBuilderContent;
}

export interface SaveResumeBuilderRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor_data: any;
  title: string;
}

export interface SaveResumeBuilderResponse {
  success: boolean;
  message: string;
  updated_at: string;
}

export interface GeneratePdfResponse {
  success: boolean;
  file_url: string;
  message: string;
}

export interface DeleteResumeBuilderResponse {
  success: boolean;
  message: string;
}
