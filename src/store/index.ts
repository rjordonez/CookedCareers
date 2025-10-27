import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '@/lib/api';
import resumeFiltersReducer from '@/features/resumes/resumeSlice';
import projectPaginationReducer from '@/features/projects/projectSlice';
import anonymizerReducer from '@/features/anonymizer/anonymizerSlice';

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['resumeFilters', 'projectPagination'], // Only persist these slices
  // Note: anonymizer is NOT persisted - sessions are managed by backend
};

// Combine all reducers
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  resumeFilters: resumeFiltersReducer,
  projectPagination: projectPaginationReducer,
  anonymizer: anonymizerReducer,
});

// Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    // @ts-expect-error - Type conflict between RTK Query and redux-persist is a known issue
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions and state paths
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
        ignoredPaths: ['register'],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
