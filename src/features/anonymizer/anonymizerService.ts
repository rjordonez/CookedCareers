import { baseApi } from '@/lib/api';
import type {
  DetectPIIResponse,
  SaveAnonymizedRequest,
  SaveAnonymizedResponse,
  GenerateAnonymizedPDFRequest,
  GenerateAnonymizedPDFResponse,
  SaveSessionRequest,
  SaveSessionResponse,
  ListSessionsResponse,
  LoadSessionResponse,
  CreateShareLinkRequest,
  CreateShareLinkResponse,
  GetSharedSessionResponse,
} from './anonymizerTypes';

export const anonymizerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    detectPII: builder.mutation<DetectPIIResponse, FormData>({
      query: (formData) => ({
        url: '/api/anonymizer/detect-pii',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Anonymizer'],
    }),

    saveAnonymized: builder.mutation<SaveAnonymizedResponse, SaveAnonymizedRequest>({
      query: (data) => ({
        url: '/api/anonymizer/save-anonymized',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Anonymizer'],
    }),

    generateAnonymizedPDF: builder.mutation<
      GenerateAnonymizedPDFResponse,
      GenerateAnonymizedPDFRequest
    >({
      query: (data) => ({
        url: '/api/anonymizer/generate-anonymized-pdf',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Anonymizer'],
    }),

    // Session management endpoints
    listSessions: builder.query<ListSessionsResponse, void>({
      query: () => '/api/anonymizer/sessions',
      providesTags: ['Anonymizer'],
    }),

    loadSession: builder.query<LoadSessionResponse, string>({
      query: (sessionId) => `/api/anonymizer/sessions/${sessionId}`,
      providesTags: ['Anonymizer'],
    }),

    saveSession: builder.mutation<SaveSessionResponse, SaveSessionRequest>({
      query: (data) => ({
        url: '/api/anonymizer/save-session',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Anonymizer'],
    }),

    // Share link endpoints
    createShareLink: builder.mutation<CreateShareLinkResponse, CreateShareLinkRequest>({
      query: (data) => ({
        url: '/api/anonymizer/create-share-link',
        method: 'POST',
        body: data,
      }),
    }),

    getSharedSession: builder.query<GetSharedSessionResponse, string>({
      query: (token) => `/api/anonymizer/share/${token}`,
      // Public endpoint - no auth required
    }),
  }),
});

export const {
  useDetectPIIMutation,
  useSaveAnonymizedMutation,
  useGenerateAnonymizedPDFMutation,
  useListSessionsQuery,
  useLoadSessionQuery,
  useSaveSessionMutation,
  useCreateShareLinkMutation,
  useGetSharedSessionQuery,
} = anonymizerApi;
