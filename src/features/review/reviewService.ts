import { baseApi } from '@/lib/api';
import type {
  SubmitReviewResponse,
  ListSubmissionsResponse,
  GetSubmissionResponse,
  DeleteSubmissionResponse,
} from './reviewTypes';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Submit a new resume for review
    submitReview: builder.mutation<SubmitReviewResponse, FormData>({
      query: (formData) => ({
        url: '/api/review/submit',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Review'],
    }),

    // Get all submissions for the authenticated user
    listSubmissions: builder.query<ListSubmissionsResponse, void>({
      query: () => '/api/review/submissions',
      providesTags: ['Review'],
    }),

    // Get details of a single submission
    getSubmission: builder.query<GetSubmissionResponse, string>({
      query: (submissionId) => `/api/review/submissions/${submissionId}`,
      providesTags: (_result, _error, submissionId) => [
        { type: 'Review', id: submissionId },
      ],
    }),

    // Delete a submission
    deleteSubmission: builder.mutation<DeleteSubmissionResponse, string>({
      query: (submissionId) => ({
        url: `/api/review/submissions/${submissionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useSubmitReviewMutation,
  useListSubmissionsQuery,
  useGetSubmissionQuery,
  useDeleteSubmissionMutation,
} = reviewApi;
