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

export interface CompareResumeResponse {
  success: boolean;
  overall_match_score: number;
  user_resume_ats_score: number;
  db_resume_ats_score: number;
  what_to_write_instead: Array<{
    original: string;
    improved: string;
  }>;
  whats_working: string[];
  what_needs_work: string[];
  next_steps: string[];
  db_resume_name: string;
}

export interface CompareResumeRequest {
  resume_id: string;
}

export interface GetResumeHtmlResponse {
  success: boolean;
  html: string;
}

export interface ExportResumePdfRequest {
  html: string;
}
