import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProjectsParams } from './projectTypes';

interface ProjectPaginationState {
  currentPage: number;
  itemsPerPage: number;
}

const initialState: ProjectPaginationState = {
  currentPage: 1,
  itemsPerPage: 20,
};

const projectSlice = createSlice({
  name: 'projectPagination',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to page 1 when changing items per page
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.itemsPerPage = 20;
    },
  },
});

export const {
  setCurrentPage,
  setItemsPerPage,
  resetPagination,
} = projectSlice.actions;

export default projectSlice.reducer;

// Selector to convert state to API params
export const selectProjectParams = (
  state: { projectPagination: ProjectPaginationState }
): ProjectsParams => {
  const pagination = state.projectPagination;
  return {
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
  };
};
