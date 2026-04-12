import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SubscriptionContextProps {
  isProUser: boolean;
  upgradeToPro: () => Promise<void>;
  resetToFree: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      const stored = await AsyncStorage.getItem('@pro_status');
      if (stored === 'true') {
        setIsProUser(true);
      }
    };
    loadStatus();
  }, []);

  const upgradeToPro = async () => {
    setIsProUser(true);
    await AsyncStorage.setItem('@pro_status', 'true');
  };

  const resetToFree = async () => {
    setIsProUser(false);
    await AsyncStorage.removeItem('@pro_status');
  };

  return (
    <SubscriptionContext.Provider value={{ isProUser, upgradeToPro, resetToFree }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
