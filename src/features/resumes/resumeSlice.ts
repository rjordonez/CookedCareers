import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ResumeSearchParams } from './resumeTypes';

interface ResumeFiltersState {
  searchQuery: string;
  seniority: string;
  skills: string;
  school: string;
  minExperience: number | undefined;
  maxExperience: number | undefined;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: ResumeFiltersState = {
  searchQuery: '',
  seniority: '',
  skills: '',
  school: '',
  minExperience: undefined,
  maxExperience: undefined,
  currentPage: 1,
  itemsPerPage: 20,
};

const resumeSlice = createSlice({
  name: 'resumeFilters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to page 1 when search changes
    },
    setSeniority: (state, action: PayloadAction<string>) => {
      state.seniority = action.payload;
      state.currentPage = 1;
    },
    setSkills: (state, action: PayloadAction<string>) => {
      state.skills = action.payload;
      state.currentPage = 1;
    },
    setSchool: (state, action: PayloadAction<string>) => {
      state.school = action.payload;
      state.currentPage = 1;
    },
    setExperienceRange: (
      state,
      action: PayloadAction<{ min?: number; max?: number }>
    ) => {
      state.minExperience = action.payload.min;
      state.maxExperience = action.payload.max;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.seniority = '';
      state.skills = '';
      state.school = '';
      state.minExperience = undefined;
      state.maxExperience = undefined;
      state.currentPage = 1;
    },
  },
});

export const {
  setSearchQuery,
  setSeniority,
  setSkills,
  setSchool,
  setExperienceRange,
  setCurrentPage,
  resetFilters,
} = resumeSlice.actions;

export default resumeSlice.reducer;

// Selector to convert state to API params
export const selectResumeSearchParams = (
  state: { resumeFilters: ResumeFiltersState }
): ResumeSearchParams => {
  const filters = state.resumeFilters;
  return {
    q: filters.searchQuery || undefined,
    seniority: filters.seniority || undefined,
    skills: filters.skills || undefined,
    school: filters.school || undefined,
    min_experience: filters.minExperience,
    max_experience: filters.maxExperience,
    page: filters.currentPage,
    limit: filters.itemsPerPage,
  };
};
