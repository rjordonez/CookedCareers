import { baseApi } from '@/lib/api';
import type { UserResume, ListUserResumesResponse } from './userResumeTypes';

export const userResumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserResume: builder.query<UserResume | null, void>({
      query: () => '/api/user-resumes',
      transformResponse: (response: ListUserResumesResponse) => {
        // Return the first (most recent) resume or null if none exist
        return response.resumes && response.resumes.length > 0 ? response.resumes[0] : null;
      },
    }),
  }),
});

export const { useGetUserResumeQuery } = userResumeApi;
