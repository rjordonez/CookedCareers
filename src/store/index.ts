import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@/lib/api';
import resumeFiltersReducer from '@/features/resumes/resumeSlice';
import projectPaginationReducer from '@/features/projects/projectSlice';
import anonymizerReducer from '@/features/anonymizer/anonymizerSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    resumeFilters: resumeFiltersReducer,
    projectPagination: projectPaginationReducer,
    anonymizer: anonymizerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
