import { baseApi } from '@/lib/api';
import type {
  DetectPIIResponse,
  SaveAnonymizedRequest,
  SaveAnonymizedResponse,
  GenerateAnonymizedPDFRequest,
  GenerateAnonymizedPDFResponse,
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
  }),
});

export const {
  useDetectPIIMutation,
  useSaveAnonymizedMutation,
  useGenerateAnonymizedPDFMutation,
} = anonymizerApi;
