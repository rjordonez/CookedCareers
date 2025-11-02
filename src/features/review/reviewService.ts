import { baseApi } from '@/lib/api';
import type {
  SubmitReviewResponse,
  ListSubmissionsResponse,
  GetSubmissionResponse,
  DeleteSubmissionResponse,
  CreateAnnotationRequest,
  CreateAnnotationResponse,
  GetAnnotationsResponse,
  DeleteAnnotationResponse,
  CreateReviewCheckoutResponse,
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

    // Create an annotation (admin only)
    createAnnotation: builder.mutation<CreateAnnotationResponse, CreateAnnotationRequest>({
      query: (annotation) => ({
        url: '/api/review/admin/annotations',
        method: 'POST',
        body: annotation,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Review', id: arg.submission_id },
      ],
    }),

    // Get annotations for a submission
    getAnnotations: builder.query<GetAnnotationsResponse, string>({
      query: (submissionId) => `/api/review/submissions/${submissionId}/annotations`,
      providesTags: (_result, _error, submissionId) => [
        { type: 'Review', id: submissionId },
      ],
    }),

    // Delete an annotation (admin only)
    deleteAnnotation: builder.mutation<DeleteAnnotationResponse, string>({
      query: (annotationId) => ({
        url: `/api/review/admin/annotations/${annotationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),

    // Create checkout session for review payment
    createReviewCheckout: builder.mutation<CreateReviewCheckoutResponse, string>({
      query: (submissionId) => ({
        url: `/api/review/create-checkout/${submissionId}`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, submissionId) => [
        { type: 'Review', id: submissionId },
      ],
    }),
  }),
});

export const {
  useSubmitReviewMutation,
  useListSubmissionsQuery,
  useGetSubmissionQuery,
  useDeleteSubmissionMutation,
  useCreateAnnotationMutation,
  useGetAnnotationsQuery,
  useDeleteAnnotationMutation,
  useCreateReviewCheckoutMutation,
} = reviewApi;
