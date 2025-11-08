// ATS API Types

export interface ATSSuggestion {
  category: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
}

export interface ATSAnalysisResponse {
  success: boolean;
  score: number;
  suggestions: ATSSuggestion[];
}
