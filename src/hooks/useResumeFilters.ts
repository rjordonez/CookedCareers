import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import type { ResumeSearchParams } from '@/features/resumes/resumeTypes';

export const useResumeFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    searchQuery: searchParams.get('q') || '',
    seniority: searchParams.get('seniority') || '',
    school: searchParams.get('school') || '',
    minExperience: searchParams.get('min_exp') ? Number(searchParams.get('min_exp')) : undefined,
    maxExperience: searchParams.get('max_exp') ? Number(searchParams.get('max_exp')) : undefined,
    currentPage: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  }), [searchParams]);

  const apiParams: ResumeSearchParams = useMemo(() => ({
    q: filters.searchQuery || undefined,
    seniority: filters.seniority || undefined,
    school: filters.school || undefined,
    min_experience: filters.minExperience,
    max_experience: filters.maxExperience,
    page: filters.currentPage,
    limit: 20,
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

  const setSeniority = useCallback((seniority: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (seniority) {
        newParams.set('seniority', seniority);
      } else {
        newParams.delete('seniority');
      }
      newParams.set('page', '1');
      return newParams;
    });
  }, [setSearchParams]);

  const setSchool = useCallback((school: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (school) {
        newParams.set('school', school);
      } else {
        newParams.delete('school');
      }
      newParams.set('page', '1');
      return newParams;
    });
  }, [setSearchParams]);

  const setExperienceRange = useCallback((range: { min?: number; max?: number }) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (range.min !== undefined) {
        newParams.set('min_exp', String(range.min));
      } else {
        newParams.delete('min_exp');
      }
      if (range.max !== undefined) {
        newParams.set('max_exp', String(range.max));
      } else {
        newParams.delete('max_exp');
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
    filters.seniority ||
    filters.school ||
    filters.minExperience !== undefined ||
    filters.maxExperience !== undefined
  );

  return {
    filters,
    apiParams,
    setSearchQuery,
    setSeniority,
    setSchool,
    setExperienceRange,
    setCurrentPage,
    resetFilters,
    hasActiveFilters,
  };
};
