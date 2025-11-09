import { baseApi } from '@/lib/api';
import type {
  UserResume,
  ListUserResumesResponse,
  ListResumesResponse,
  CreateResumeBuilderResponse,
  GetResumeBuilderResponse,
  SaveResumeBuilderRequest,
  SaveResumeBuilderResponse,
  GeneratePdfResponse,
  DeleteResumeBuilderResponse,
} from './userResumeTypes';

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
    uploadUserResume: builder.mutation<{ success: boolean; message: string; resume_id: string; file_url: string }, FormData>({
      query: (formData) => ({
        url: '/api/user-resume/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Resume'],
    }),

    // Resume Builder Endpoints
    createResumeBuilder: builder.mutation<CreateResumeBuilderResponse, { title?: string }>({
      query: (body) => ({
        url: '/api/resume-builder/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Resume'],
    }),
    getResumeBuilder: builder.query<GetResumeBuilderResponse, string>({
      query: (resumeId) => `/api/resume-builder/${resumeId}`,
      providesTags: ['Resume'],
    }),
    saveResumeBuilder: builder.mutation<SaveResumeBuilderResponse, { resumeId: string; data: SaveResumeBuilderRequest }>({
      query: ({ resumeId, data }) => ({
        url: `/api/resume-builder/${resumeId}/save`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Resume'],
    }),
    generateResumePdf: builder.mutation<GeneratePdfResponse, { resumeId: string; html: string }>({
      query: (args) => ({
        url: `/api/resume-builder/${args.resumeId}/generate-pdf`,
        method: 'POST',
        body: { html: args.html },
      }),
    }),
    deleteResumeBuilder: builder.mutation<DeleteResumeBuilderResponse, string>({
      query: (resumeId) => ({
        url: `/api/resume-builder/${resumeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resume'],
    }),
  }),
});

export const {
  useGetUserResumeQuery,
  useListUserResumesQuery,
  useUploadUserResumeMutation,
  useCreateResumeBuilderMutation,
  useGetResumeBuilderQuery,
  useSaveResumeBuilderMutation,
  useGenerateResumePdfMutation,
  useDeleteResumeBuilderMutation,
} = userResumeApi;
