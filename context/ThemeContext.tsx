import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: Record<string, string>;
  isLoaded: boolean;
}

const lightColors = {
  background: '#F0F0F0',
  card: '#FFFFFF',
  text: '#000000',
  subText: '#666666',
  border: '#E0E0E0',
  badgePositive: 'rgba(52, 199, 89, 0.2)',
  badgeNegative: 'rgba(255, 59, 48, 0.2)',
};

const darkColors = {
  background: '#000000',
  card: '#1E1E1E',
  text: '#FFFFFF',
  subText: '#A0A0A0',
  border: '#333333',
  badgePositive: 'rgba(52, 199, 89, 0.2)',
  badgeNegative: 'rgba(255, 59, 48, 0.2)',
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(systemScheme === 'dark' ? 'dark' : 'light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@app_theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
          setTheme(storedTheme);
        }
      } catch (e) {
        console.error('Failed to load theme.', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    await AsyncStorage.setItem('@app_theme', newTheme);
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
