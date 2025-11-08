import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import type { ProjectsParams } from '@/features/projects/projectTypes';

export const useProjectFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    searchQuery: searchParams.get('q') || '',
    technologies: searchParams.get('technologies') || '',
    currentPage: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  }), [searchParams]);

  const apiParams: ProjectsParams = useMemo(() => ({
    q: filters.searchQuery || undefined,
    technologies: filters.technologies || undefined,
    page: filters.currentPage,
    limit: 12,
  }), [filters]);

  const setSearchQuery = useCallback((query: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (query) {
        newParams.set('q', query);
      } else {
        newParams.delete('q');
      }
      newParams.set('page', '1');
      return newParams;
    });
  }, [setSearchParams]);

  const setTechnologies = useCallback((technologies: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (technologies) {
        newParams.set('technologies', technologies);
      } else {
        newParams.delete('technologies');
      }
      newParams.set('page', '1');
      return newParams;
    });
  }, [setSearchParams]);

  const setCurrentPage = useCallback((page: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', String(page));
      return newParams;
    });
  }, [setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const hasActiveFilters = !!(
    filters.searchQuery ||
    filters.technologies
  );

  return {
    filters,
    apiParams,
    setSearchQuery,
    setTechnologies,
    setCurrentPage,
    resetFilters,
    hasActiveFilters,
  };
};
