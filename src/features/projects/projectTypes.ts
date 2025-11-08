// Project API Types based on backend API structure

export interface Project {
  project_name: string;
  project_url: string;
  project_description: string;
  project_technologies: string[];
  owner_id: string;
  owner_name: string;
  owner_email: string;
  owner_title: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ProjectsResponse {
  projects: Project[];
  pagination: Pagination;
}

export interface ProjectsParams {
  q?: string;
  technologies?: string;
  page?: number;
  limit?: number;
}
