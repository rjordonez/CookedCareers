import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setAuthTokenGetter } from '@/lib/api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) {
      console.log('Clerk not loaded yet...');
      return;
    }

    console.log('AuthProvider: Setting up token getter, isSignedIn:', isSignedIn);

    // Create a fresh token getter that ALWAYS calls getToken
    const tokenGetter = async () => {
      try {
        if (!isSignedIn) {
          console.warn('User not signed in, cannot get token');
          return null;
        }

        console.log('Getting fresh token from Clerk...');
        const token = await getToken();
        console.log('Token retrieved:', token ? 'SUCCESS' : 'FAILED');
        return token;
      } catch (error) {
        console.error('Error getting Clerk token:', error);
        return null;
      }
    };

    // Re-set the getter whenever auth state changes
    setAuthTokenGetter(tokenGetter);
    console.log('Token getter registered');
  }, [getToken, isSignedIn, isLoaded]);

  return <>{children}</>;
};
