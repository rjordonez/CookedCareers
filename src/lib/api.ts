import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8080';

console.log('📡 API module loaded, base URL:', API_BASE_URL);

// Store for getting auth token - will be set by Clerk provider
let getAuthToken: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  console.log('🔧 setAuthTokenGetter called');
  getAuthToken = getter;
};

// Create base API configuration
console.log('🏗️ Creating baseApi...');
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
      console.log('🔵 prepareHeaders called, getAuthToken exists:', !!getAuthToken);

      if (getAuthToken) {
        try {
          const token = await getAuthToken();
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
            console.log('✅ Token attached to request:', token.substring(0, 20) + '...');
          } else {
            console.warn('⚠️ No token available for request');
          }
        } catch (error) {
          console.error('❌ Failed to get auth token:', error);
        }
      } else {
        console.warn('❌ getAuthToken not initialized');
      }
      return headers;
    },
  }),
  tagTypes: ['Resume', 'Project', 'Subscription'],
  endpoints: () => ({}),
});
