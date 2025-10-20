import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API URL - can be moved to environment variables later
export const API_BASE_URL = 'http://0.0.0.0:8080';

// Create base API configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    // Add credentials if needed for auth
    // credentials: 'include',
  }),
  tagTypes: ['Resume', 'Project'],
  endpoints: () => ({}),
});
