import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from './useAuthState';

/**
 * Hook to handle authentication requirements and redirects
 * Automatically redirects to /auth if user is not signed in
 * Also provides a requireAuth function for manual checks
 *
 * @param {boolean} autoRedirect - Whether to auto-redirect on mount (default: true)
 * @returns {object} Auth check utilities
 */
export const useRequireAuth = (autoRedirect = true) => {
  const navigate = useNavigate();
  const { isSignedIn, authReady } = useAuthState();

  // Auto-redirect to auth page if not signed in
  useEffect(() => {
    if (autoRedirect && authReady && !isSignedIn) {
      navigate('/auth');
    }
  }, [autoRedirect, authReady, isSignedIn, navigate]);

  /**
   * Manual auth check - use this in event handlers
   * Returns false and redirects to /auth if not signed in
   */
  const requireAuth = useCallback(() => {
    if (!isSignedIn) {
      navigate('/auth');
      return false;
    }
    return true;
  }, [isSignedIn, navigate]);

  return {
    requireAuth,
    isSignedIn,
    authReady,
  };
};
