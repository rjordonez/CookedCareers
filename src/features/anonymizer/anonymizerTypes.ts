// Anonymizer API Types based on backend API structure

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextStyle {
  font_name: string;
  font_size: number;
  color: number;
  flags: number;
}

export interface PIIDetection {
  type: PIIType;
  text: string;
  page: number;
  bbox: BoundingBox;
  confidence: number;
  style: TextStyle;
}

export type PIIType =
  | 'email'
  | 'phone'
  | 'name'
  | 'company'
  | 'school'
  | 'linkedin'
  | 'github'
  | 'website';

export interface DetectPIIResponse {
  success: boolean;
  file_id: string;
  original_url: string;
  detections: PIIDetection[];
  total_pages: number;
  error?: string;
}

export interface SaveAnonymizedRequest {
  file_id: string;
  detections: PIIDetection[];
}

export interface SaveAnonymizedResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ReplacementItem {
  page: number;
  bbox: BoundingBox;
  original_text: string;
  replacement_text: string;
  type: string;
  style: TextStyle;
}

export interface GenerateAnonymizedPDFRequest {
  file_id: string;
  replacements: ReplacementItem[];
}

export interface GenerateAnonymizedPDFResponse {
  success: boolean;
  anonymized_url?: string;
  original_url?: string;
  error?: string;
}

// Frontend-only types for UI state
export interface PIIDetectionWithBlur extends PIIDetection {
  blurred: boolean;
  replacementText?: string; // Custom text to display instead of original
}

export interface ManualBlurRegion {
  page: number;
  bbox: BoundingBox;
  id: string;
}

export interface DetectionStats {
  total: number;
  blurred: number;
  byType: Record<PIIType, number>;
}

export const PII_TYPE_COLORS: Record<PIIType, string> = {
  email: 'bg-blue-100 text-blue-700',
  phone: 'bg-green-100 text-green-700',
  name: 'bg-purple-100 text-purple-700',
  company: 'bg-orange-100 text-orange-700',
  school: 'bg-pink-100 text-pink-700',
  linkedin: 'bg-cyan-100 text-cyan-700',
  github: 'bg-gray-100 text-gray-700',
  website: 'bg-indigo-100 text-indigo-700',
};
