import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export interface DarkPoolPrint {
  id: string;
  ticker: string;
  type: string;
  shares: string;
  price: number;
  bullish: number;
  bearish: number;
  time: string;
}

interface AdminContextProps {
  isAdmin: boolean;
  setAdminMode: (val: boolean) => void;
  prints: DarkPoolPrint[];
  addPrint: (print: Omit<DarkPoolPrint, 'id'>) => Promise<void>;
  updatePrint: (id: string, print: Partial<DarkPoolPrint>) => Promise<void>;
  deletePrint: (id: string) => Promise<void>;
  canAccessAdmin: boolean;
}

const AUTHORIZED_ADMINS = [
  'brian@mail.com',
  'veronica@mail.com',
  'admin@stockwhisperer.com',
  'member@stockwhisperer.com',
  'stefanie@stockwhisperer.com',
];

const DEFAULT_PRINTS: DarkPoolPrint[] = [
  { id: '1', ticker: 'SPY', type: 'Late Print', shares: '2.5M', price: 512.43, bullish: 513, bearish: 512, time: '10:02 AM' },
  { id: '2', ticker: 'NVDA', type: 'Block Trade', shares: '850K', price: 875.10, bullish: 878, bearish: 870, time: '11:45 AM' },
  { id: '3', ticker: 'TSLA', type: 'Dark Pool', shares: '1.2M', price: 172.50, bullish: 175, bearish: 170, time: '1:15 PM' },
  { id: '4', ticker: 'QQQ', type: 'Signature Print', shares: '3.1M', price: 440.20, bullish: 442, bearish: 438, time: '2:30 PM' },
];

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [prints, setPrints] = useState<DarkPoolPrint[]>(DEFAULT_PRINTS);

  const canAccessAdmin = user ? AUTHORIZED_ADMINS.includes(user.email.toLowerCase()) : false;

  // Auto-disable admin mode if user is not authorized
  useEffect(() => {
    if (!canAccessAdmin && isAdmin) {
      setIsAdmin(false);
    }
  }, [canAccessAdmin, isAdmin]);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('@dark_pool_prints');
      if (stored) setPrints(JSON.parse(stored));
    };
    load();
  }, []);

  const save = async (newPrints: DarkPoolPrint[]) => {
    setPrints(newPrints);
    await AsyncStorage.setItem('@dark_pool_prints', JSON.stringify(newPrints));
  };

  const addPrint = async (print: Omit<DarkPoolPrint, 'id'>) => {
    const newPrints = [...prints, { ...print, id: Date.now().toString() }];
    await save(newPrints);
  };

  const updatePrint = async (id: string, partial: Partial<DarkPoolPrint>) => {
    const newPrints = prints.map(p => p.id === id ? { ...p, ...partial } : p);
    await save(newPrints);
  };

  const deletePrint = async (id: string) => {
    const newPrints = prints.filter(p => p.id !== id);
    await save(newPrints);
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      setAdminMode: setIsAdmin,
      prints,
      addPrint,
      updatePrint,
      deletePrint,
      canAccessAdmin
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
