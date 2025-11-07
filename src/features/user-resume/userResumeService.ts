import { baseApi } from '@/lib/api';
import type { UserResume, ListUserResumesResponse, ListResumesResponse } from './userResumeTypes';

export const userResumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserResume: builder.query<UserResume | null, void>({
      query: () => '/api/user-resumes',
      transformResponse: (response: ListUserResumesResponse) => {
        // Return the first (most recent) resume or null if none exist
        return response.resumes && response.resumes.length > 0 ? response.resumes[0] : null;
      },
    }),
    listUserResumes: builder.query<ListResumesResponse, void>({
      query: () => '/api/user-resume/list',
      providesTags: ['Resume'],
    }),
    uploadUserResume: builder.mutation<{ success: boolean; message: string }, FormData>({
      query: (formData) => ({
        url: '/api/user-resume/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Resume'],
    }),
  }),
});

export const { useGetUserResumeQuery, useListUserResumesQuery, useUploadUserResumeMutation } = userResumeApi;
