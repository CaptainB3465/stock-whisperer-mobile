/**
 * Cached, rate-limited Finnhub API service.
 * - 30 second TTL cache per ticker
 * - Max 4 calls/second (250ms minimum interval)
 * - Up to 3 retries with exponential backoff
 */

const API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY || '';
const BASE_URL = 'https://finnhub.io/api/v1';
const CACHE_TTL_MS = 30_000;

// --- In-memory LRU cache ---
const quoteCache = new Map<string, { data: StockQuote; ts: number }>();
const candleCache = new Map<string, { data: CandlePoint[]; ts: number }>();

// --- Rate limiter ---
let lastCallTime = 0;
const MIN_INTERVAL_MS = 250;

async function throttledFetch(url: string, retries = 3): Promise<any> {
  const now = Date.now();
  const elapsed = now - lastCallTime;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise(r => setTimeout(r, MIN_INTERVAL_MS - elapsed));
  }
  lastCallTime = Date.now();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        // Rate limited — wait longer
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
}

export interface StockQuote {
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
}

export interface CandlePoint {
  value: number;
  label?: string;
}

export async function fetchQuote(ticker: string): Promise<StockQuote | null> {
  const cached = quoteCache.get(ticker);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const data = await throttledFetch(`${BASE_URL}/quote?symbol=${ticker}&token=${API_KEY}`);
    if (!data || data.c === 0) return null;
    const quote: StockQuote = {
      currentPrice: data.c,
      change: data.d || 0,
      percentChange: data.dp || 0,
      high: data.h || 0,
      low: data.l || 0,
      open: data.o || 0,
      prevClose: data.pc || 0,
    };
    quoteCache.set(ticker, { data: quote, ts: Date.now() });
    return quote;
  } catch (err) {
    console.error('fetchQuote failed:', ticker, err);
    return null;
  }
}

// resolution: 'D' = daily, '60' = hourly, '5' = 5min
export async function fetchCandles(
  ticker: string,
  resolution: 'D' | '60' | '5' = 'D',
  days: number = 30
): Promise<CandlePoint[]> {
  const cacheKey = `${ticker}_${resolution}_${days}`;
  const cached = candleCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const to = Math.floor(Date.now() / 1000);
    const from = to - days * 24 * 60 * 60;
    const data = await throttledFetch(
      `${BASE_URL}/stock/candle?symbol=${ticker}&resolution=${resolution}&from=${from}&to=${to}&token=${API_KEY}`
    );
    if (data.s !== 'ok' || !data.c) return [];

    const points: CandlePoint[] = data.c.map((price: number, i: number) => ({
      value: price,
      label: i === 0 || i === data.c.length - 1 ? `$${price.toFixed(0)}` : undefined,
    }));

    candleCache.set(cacheKey, { data: points, ts: Date.now() });
    return points;
  } catch (err) {
    console.error('fetchCandles failed:', ticker, err);
    return [];
  }
}

export function clearCache() {
  quoteCache.clear();
  candleCache.clear();
}
