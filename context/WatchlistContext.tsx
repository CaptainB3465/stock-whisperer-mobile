import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WatchlistContextProps {
  watchlist: string[];
  addTicker: (ticker: string) => Promise<void>;
  removeTicker: (ticker: string) => Promise<void>;
  isInWatchlist: (ticker: string) => boolean;
  isLoaded: boolean;
}

const WatchlistContext = createContext<WatchlistContextProps | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const stored = await AsyncStorage.getItem('@watchlist');
        if (stored) {
          setWatchlist(JSON.parse(stored));
        } else {
          // Default starting watchlist
          setWatchlist(['AAPL', 'TSLA', 'MSFT', 'NVDA']);
        }
      } catch (e) {
        console.error('Failed to load watchlist', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadWatchlist();
  }, []);

  const addTicker = async (ticker: string) => {
    if (watchlist.includes(ticker)) return;
    const newList = [...watchlist, ticker];
    setWatchlist(newList);
    await AsyncStorage.setItem('@watchlist', JSON.stringify(newList));
  };

  const removeTicker = async (ticker: string) => {
    const newList = watchlist.filter(t => t !== ticker);
    setWatchlist(newList);
    await AsyncStorage.setItem('@watchlist', JSON.stringify(newList));
  };

  const isInWatchlist = (ticker: string) => watchlist.includes(ticker);

  return (
    <WatchlistContext.Provider value={{ watchlist, addTicker, removeTicker, isInWatchlist, isLoaded }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
