import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8080';

// Store for getting auth token - will be set by Clerk provider
let getAuthToken: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  getAuthToken = getter;
};

// Create base API configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
      if (getAuthToken) {
        try {
          const token = await getAuthToken();
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
        } catch (error) {
          console.error('Failed to get auth token:', error);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Resume', 'Project', 'Subscription'],
  endpoints: () => ({}),
});
