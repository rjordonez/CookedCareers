import { baseApi } from '@/lib/api';
import type { ProjectsResponse, ProjectsParams } from './projectTypes';

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsResponse, ProjectsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.q) searchParams.append('q', params.q);
        if (params.technologies) searchParams.append('technologies', params.technologies);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());

        return {
          url: `/api/projects/search?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Project'],
    }),
  }),
});

export const { useGetProjectsQuery } = projectApi;
