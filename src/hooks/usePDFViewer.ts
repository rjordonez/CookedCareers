import { useState, useCallback } from 'react';

/**
 * Consolidated hook for PDF viewer state management
 * Handles page navigation, zoom, and loading states
 *
 * @param {number} initialScale - Initial zoom scale (default: 1.0)
 * @returns {object} PDF viewer state and controls
 */
export const usePDFViewer = (initialScale = 1.0) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(initialScale);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1));
  }, [numPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(numPages, page)));
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(3, prev + 0.1));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(0.5, prev - 0.1));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(initialScale);
  }, [initialScale]);

  const canGoNext = currentPage < numPages;
  const canGoPrev = currentPage > 1;

  return {
    // State
    currentPage,
    numPages,
    scale,
    loadingPdf,

    // Setters
    setCurrentPage,
    setNumPages,
    setScale,
    setLoadingPdf,

    // Navigation
    nextPage,
    prevPage,
    goToPage,

    // Zoom
    zoomIn,
    zoomOut,
    resetZoom,

    // Helpers
    canGoNext,
    canGoPrev,
  };
};
