import { baseApi } from '@/lib/api';
import type { UserResume, ListUserResumesResponse } from './userResumeTypes';

// Response type matching backend API spec
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

// Request type for compare endpoint
export interface CompareResumeRequest {
  resume_id: string;
}

export const userResumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserResume: builder.query<UserResume | null, void>({
      query: () => '/api/user-resumes',
      transformResponse: (response: ListUserResumesResponse) => {
        // Return the first (most recent) resume or null if none exist
        return response.resumes && response.resumes.length > 0 ? response.resumes[0] : null;
      },
    }),
    compareResume: builder.mutation<CompareResumeResponse, CompareResumeRequest>({
      query: (body) => ({
        url: '/api/user-resume/compare',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetUserResumeQuery, useCompareResumeMutation } = userResumeApi;
