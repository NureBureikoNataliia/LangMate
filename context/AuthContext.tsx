import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInUser, signUpUser, getCurrentUser, updateUserProfile } from '@/services/authService';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  const signIn = async (email: string, password: string) => {
    const loggedInUser = await signInUser(email, password);
    setUser(loggedInUser);
  };
  
  const signUp = async (name: string, email: string, password: string) => {
    const newUser = await signUpUser(name, email, password);
    setUser(newUser);
  };
  
  const signOut = () => {
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user?._id) return;
    
    const updatedUser = await updateUserProfile({
      _id: user._id,
      ...userData
    });
    setUser(updatedUser);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}