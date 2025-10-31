// Review submission types matching backend schema

export interface ReviewSubmissionSummary {
  id: string;
  filename: string;
  status: 'pending' | 'completed';
  file_url: string;
  reviewed_file_url: string | null;
  submitted_at: string;
  completed_at: string | null;
}

export interface ReviewSubmissionDetail extends ReviewSubmissionSummary {
  user_id: string;
  storage_path: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface SubmitReviewResponse {
  success: boolean;
  submission_id: string;
  file_url: string;
  message: string;
}

export interface ListSubmissionsResponse {
  success: boolean;
  submissions: ReviewSubmissionSummary[];
}

export interface GetSubmissionResponse {
  success: boolean;
  submission: ReviewSubmissionDetail;
}

export interface DeleteSubmissionResponse {
  success: boolean;
  message: string;
}
