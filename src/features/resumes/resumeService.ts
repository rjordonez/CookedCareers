import { baseApi } from '@/lib/api';
import type { ResumeSearchResponse, ResumeSearchParams } from './resumeTypes';

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchResumes: builder.query<ResumeSearchResponse, ResumeSearchParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Add all non-undefined parameters to query string
        if (params.q) searchParams.append('q', params.q);
        if (params.seniority) searchParams.append('seniority', params.seniority);
        if (params.skills) searchParams.append('skills', params.skills);
        if (params.school) searchParams.append('school', params.school);
        if (params.min_experience !== undefined) {
          searchParams.append('min_experience', params.min_experience.toString());
        }
        if (params.max_experience !== undefined) {
          searchParams.append('max_experience', params.max_experience.toString());
        }
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());

        return {
          url: `/api/resumes/search?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Resume'],
    }),
  }),
});

export const { useSearchResumesQuery, useLazySearchResumesQuery } = resumeApi;
