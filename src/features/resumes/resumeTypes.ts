// Resume API Types based on backend API structure

export interface Experience {
  company?: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface Education {
  institution?: string;
  degree?: string;
  field_of_study?: string;
  graduation_date?: string;
}

export interface Project {
  name?: string;
  description?: string;
  technologies?: string[];
  url?: string;
}

export interface Certification {
  name?: string;
  issuer?: string;
  date?: string;
}

export interface Resume {
  // IDs and metadata
  id: string;
  created_at: string;
  updated_at: string;

  // Basic info
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  title?: string;
  company?: string;
  seniority?: string;
  years_of_experience?: number;

  // Structured data
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];

  // File info
  file_url?: string;
  file_name?: string;
  file_type?: string;
  source_url?: string;
  search_query?: string;
  raw_text?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface FiltersApplied {
  query: string | null;
  seniority: string | null;
  skills: string[] | null;
  school: string | null;
  min_experience: number | null;
  max_experience: number | null;
}

export interface ResumeSearchResponse {
  results: Resume[];
  pagination: Pagination;
  filters_applied: FiltersApplied;
}

export interface ResumeSearchParams {
  // Text search
  q?: string;

  // Filters
  seniority?: string;
  skills?: string;
  school?: string;
  min_experience?: number;
  max_experience?: number;

  // Pagination
  page?: number;
  limit?: number;
}

export type SeniorityLevel = 'intern' | 'junior' | 'mid-level' | 'senior' | 'staff' | 'principal';
