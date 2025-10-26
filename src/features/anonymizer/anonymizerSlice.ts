import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PIIDetectionWithBlur, ManualBlurRegion } from './anonymizerTypes';

interface AnonymizerState {
  currentPage: number;
  scale: number;
  numPages: number;
  fileId: string;
  detections: PIIDetectionWithBlur[];
  manualBlurs: ManualBlurRegion[];
  isDrawingMode: boolean;
}

const initialState: AnonymizerState = {
  currentPage: 1,
  scale: 1.5,
  numPages: 0,
  fileId: '',
  detections: [],
  manualBlurs: [],
  isDrawingMode: false,
};

const anonymizerSlice = createSlice({
  name: 'anonymizer',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
    setNumPages: (state, action: PayloadAction<number>) => {
      state.numPages = action.payload;
    },
    setFileId: (state, action: PayloadAction<string>) => {
      state.fileId = action.payload;
    },
    setDetections: (state, action: PayloadAction<PIIDetectionWithBlur[]>) => {
      state.detections = action.payload;
    },
    toggleDetectionBlur: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.detections[index]) {
        state.detections[index].blurred = !state.detections[index].blurred;
      }
    },
    setReplacementText: (state, action: PayloadAction<{ index: number; text: string }>) => {
      const { index, text } = action.payload;
      if (state.detections[index]) {
        state.detections[index].replacementText = text;
      }
    },
    toggleAllBlur: (state, action: PayloadAction<boolean>) => {
      state.detections = state.detections.map(d => ({
        ...d,
        blurred: action.payload,
      }));
    },
    addManualBlur: (state, action: PayloadAction<ManualBlurRegion>) => {
      state.manualBlurs.push(action.payload);
    },
    removeManualBlur: (state, action: PayloadAction<string>) => {
      state.manualBlurs = state.manualBlurs.filter(b => b.id !== action.payload);
    },
    toggleDrawingMode: (state) => {
      state.isDrawingMode = !state.isDrawingMode;
    },
    setDrawingMode: (state, action: PayloadAction<boolean>) => {
      state.isDrawingMode = action.payload;
    },
    resetAnonymizer: () => initialState,
  },
});

export const {
  setCurrentPage,
  setScale,
  setNumPages,
  setFileId,
  setDetections,
  toggleDetectionBlur,
  toggleAllBlur,
  setReplacementText,
  addManualBlur,
  removeManualBlur,
  toggleDrawingMode,
  setDrawingMode,
  resetAnonymizer,
} = anonymizerSlice.actions;

export default anonymizerSlice.reducer;
