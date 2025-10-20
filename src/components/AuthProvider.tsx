import { useEffect, useState, createContext, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setAuthTokenGetter } from '@/lib/api';

interface AuthContextType {
  authReady: boolean;
}

const AuthContext = createContext<AuthContextType>({ authReady: false });

export const useAuthReady = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    // Create a token getter that wraps Clerk's getToken
    const tokenGetter = async () => {
      try {
        if (!isSignedIn) {
          return null;
        }

        const token = await getToken();
        return token;
      } catch (error) {
        console.error('Error getting Clerk token:', error);
        return null;
      }
    };

    // Set the getter once when auth is loaded
    setAuthTokenGetter(tokenGetter);

    // Signal that auth is ready
    setAuthReady(true);
  }, [getToken, isSignedIn, isLoaded]);

  return (
    <AuthContext.Provider value={{ authReady }}>
      {children}
    </AuthContext.Provider>
  );
};
