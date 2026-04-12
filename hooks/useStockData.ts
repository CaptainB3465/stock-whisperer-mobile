import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchQuote, StockQuote } from '@/services/api/stocks';

const POLL_INTERVAL_MS = 60_000; // 60 seconds

export function useStockData(ticker: string) {
  const [data, setData] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    if (!ticker) return;
    try {
      const quote = await fetchQuote(ticker);
      if (quote) {
        setData(quote);
        setError(null);
      } else {
        setError('Unable to fetch data');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    setLoading(true);
    load();
    intervalRef.current = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load]);

  return { data, loading, error, refresh: load };
}
