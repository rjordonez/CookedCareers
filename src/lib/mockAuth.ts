interface User {
  id: string;
  email: string;
  isPremium: boolean;
}

const MOCK_USERS_KEY = 'mock_users';
const MOCK_SESSION_KEY = 'mock_session';

export const mockAuth = {
  signUp: (email: string, password: string): { success: boolean; error?: string } => {
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
    
    if (users.find((u: User) => u.email === email)) {
      return { success: false, error: 'User already exists' };
    }
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      isPremium: false
    };
    
    users.push(newUser);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(newUser));
    
    return { success: true };
  },
  
  signIn: (email: string, password: string): { success: boolean; error?: string } => {
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
    return { success: true };
  },
  
  signOut: () => {
    localStorage.removeItem(MOCK_SESSION_KEY);
  },
  
  getSession: (): User | null => {
    const session = localStorage.getItem(MOCK_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
};
