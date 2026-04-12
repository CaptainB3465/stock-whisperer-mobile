import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  signIn: (email: string, name?: string) => Promise<void>;
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
        const storedUser = await AsyncStorage.getItem('@auth_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load session.', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadAuth();
  }, []);

  const signIn = async (email: string, name: string = 'Member') => {
    const newUser = { email, name };
    setUser(newUser);
    await AsyncStorage.setItem('@auth_user', JSON.stringify(newUser));
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@auth_user');
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
