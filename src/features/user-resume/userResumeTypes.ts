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

export interface ListUserResumesResponse {
  success: boolean;
  resumes: UserResume[];
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
