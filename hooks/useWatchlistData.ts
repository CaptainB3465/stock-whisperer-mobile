import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchQuote, StockQuote } from '@/services/api/stocks';

export interface WatchlistStock {
  ticker: string;
  quote: StockQuote | null;
  loading: boolean;
}

type SortMode = 'default' | 'gainers' | 'losers';

export function useWatchlistData(tickers: string[], sortMode: SortMode = 'gainers') {
  const [stocks, setStocks] = useState<WatchlistStock[]>(
    tickers.map(t => ({ ticker: t, quote: null, loading: true }))
  );

  const load = useCallback(async () => {
    if (tickers.length === 0) {
      setStocks([]);
      return;
    }

    // Initialize with loading states
    setStocks(tickers.map(t => ({ ticker: t, quote: null, loading: true })));

    const results = await Promise.all(
      tickers.map(async (ticker) => {
        const quote = await fetchQuote(ticker);
        return { ticker, quote, loading: false };
      })
    );
    setStocks(results);
  }, [tickers.join(',')]);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = useMemo(() => {
    const ready = stocks.filter(s => s.quote !== null);
    const loading = stocks.filter(s => s.quote === null);
    if (sortMode === 'gainers') {
      ready.sort((a, b) => (b.quote!.percentChange) - (a.quote!.percentChange));
    } else if (sortMode === 'losers') {
      ready.sort((a, b) => (a.quote!.percentChange) - (b.quote!.percentChange));
    }
    return [...ready, ...loading];
  }, [stocks, sortMode]);

  return { stocks: sorted, refresh: load };
}
