import { baseApi } from '@/lib/api';
import type { ProjectsResponse, ProjectsParams } from './projectTypes';

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsResponse, ProjectsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());

        return {
          url: `/api/resumes/projects?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Project'],
    }),
  }),
});

export const { useGetProjectsQuery } = projectApi;
