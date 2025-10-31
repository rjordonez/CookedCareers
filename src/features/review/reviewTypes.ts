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

// Annotation types
export interface AnnotationPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnnotationContent {
  selectedText?: string;
  comment: string;
}

export interface Annotation {
  id: string;
  submission_id: string;
  annotation_type: 'highlight' | 'area' | 'drawing';
  page_number: number;
  position: AnnotationPosition;
  content: AnnotationContent;
  created_at: string;
  updated_at?: string;
}

export interface CreateAnnotationRequest {
  submission_id: string;
  annotation_type: 'highlight' | 'area' | 'drawing';
  page_number: number;
  position: AnnotationPosition;
  content: AnnotationContent;
}

export interface CreateAnnotationResponse {
  success: boolean;
  annotation: Annotation;
}

export interface GetAnnotationsResponse {
  success: boolean;
  annotations: Annotation[];
}

export interface DeleteAnnotationResponse {
  success: boolean;
  message: string;
}
