import { useUser, useAuth } from '@clerk/clerk-react';
import { useAuthReady } from '@/components/AuthProvider';
import { useGetSubscriptionStatusQuery } from '@/features/subscription/subscriptionService';

/**
 * Consolidated hook for authentication and subscription state
 * Combines useUser, useAuth, useAuthReady, and subscription status
 *
 * @returns {object} Auth and subscription state
 * @property {object} user - Clerk user object
 * @property {boolean} isLoaded - Whether Clerk has loaded
 * @property {boolean} isSignedIn - Whether user is signed in
 * @property {boolean} authReady - Whether auth is ready
 * @property {Function} getToken - Function to get auth token
 * @property {boolean} querySkipCondition - Condition to skip RTK queries
 * @property {boolean} isPro - Whether user has pro subscription
 * @property {boolean} isLoadingSubscription - Whether subscription is loading
 * @property {object} subscriptionData - Full subscription data
 */
export const useAuthState = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { authReady } = useAuthReady();
  const { getToken } = useAuth();

  // Centralized skip condition for all RTK Query hooks
  const querySkipCondition = !authReady || !isSignedIn;

  // Fetch subscription status once
  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    error: subscriptionError
  } = useGetSubscriptionStatusQuery(undefined, {
    skip: querySkipCondition,
  });

  // Log subscription errors
  if (subscriptionError) {
    console.error('🔴 useAuthState: Subscription query failed');
    console.error('Error details:', subscriptionError);
  }

  const isPro = subscriptionData?.is_pro ?? false;

  return {
    user,
    isLoaded,
    isSignedIn,
    authReady,
    getToken,
    querySkipCondition,
    isPro,
    isLoadingSubscription,
    subscriptionData,
  };
};
