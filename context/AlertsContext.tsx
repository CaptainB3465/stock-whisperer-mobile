import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AlertCondition = 'above' | 'below' | 'pct_change';

export interface StockAlert {
  id: string;
  ticker: string;
  condition: AlertCondition;
  value: number;
  triggered: boolean;
}

interface AlertsContextProps {
  alerts: StockAlert[];
  addAlert: (alert: Omit<StockAlert, 'id' | 'triggered'>) => Promise<void>;
  removeAlert: (id: string) => Promise<void>;
  markTriggered: (id: string) => Promise<void>;
}

const AlertsContext = createContext<AlertsContextProps | undefined>(undefined);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('@stock_alerts').then(stored => {
      if (stored) setAlerts(JSON.parse(stored));
    });
  }, []);

  const save = async (newAlerts: StockAlert[]) => {
    setAlerts(newAlerts);
    await AsyncStorage.setItem('@stock_alerts', JSON.stringify(newAlerts));
  };

  const addAlert = async (alert: Omit<StockAlert, 'id' | 'triggered'>) => {
    await save([...alerts, { ...alert, id: Date.now().toString(), triggered: false }]);
  };

  const removeAlert = async (id: string) => {
    await save(alerts.filter(a => a.id !== id));
  };

  const markTriggered = async (id: string) => {
    await save(alerts.map(a => a.id === id ? { ...a, triggered: true } : a));
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, removeAlert, markTriggered }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error('useAlerts must be used within AlertsProvider');
  return ctx;
}
