import { baseApi } from '@/lib/api';
import type {
  SubscriptionInfo,
  CheckoutSessionResponse,
  PortalSessionResponse
} from './subscriptionTypes';

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionStatus: builder.query<SubscriptionInfo, void>({
      query: () => '/api/subscriptions/status',
      providesTags: ['Subscription'],
      transformErrorResponse: (response, meta, arg) => {
        console.error('❌ Subscription Status Error:');
        console.error('Status:', response.status);
        console.error('Response Data:', response.data);
        console.error('Full Error:', response);
        return response;
      },
    }),

    createCheckoutSession: builder.mutation<CheckoutSessionResponse, void>({
      query: () => ({
        url: '/api/subscriptions/create-checkout-session',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),

    createPortalSession: builder.mutation<PortalSessionResponse, void>({
      query: () => ({
        url: '/api/subscriptions/create-portal-session',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetSubscriptionStatusQuery,
  useCreateCheckoutSessionMutation,
  useCreatePortalSessionMutation,
} = subscriptionApi;
