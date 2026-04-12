import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  email: string;
}

interface AuthContextProps {
  user: User | null;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const email = await AsyncStorage.getItem('@auth_email');
        if (email) {
          setUser({ email });
        }
      } catch (e) {
        console.error('Failed to load session.', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadAuth();
  }, []);

  const signIn = async (email: string) => {
    setUser({ email });
    await AsyncStorage.setItem('@auth_email', email);
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@auth_email');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoaded }}>
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
