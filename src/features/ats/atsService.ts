import { baseApi } from '@/lib/api';
import type { ATSAnalysisResponse } from './atsTypes';

export const atsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    analyzeResume: builder.mutation<ATSAnalysisResponse, FormData>({
      query: (formData) => ({
        url: '/api/ats/analyze',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useAnalyzeResumeMutation } = atsApi;
