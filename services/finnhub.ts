export const FINNHUB_API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY || '';
const BASE_URL = 'https://finnhub.io/api/v1';

export async function fetchQuote(ticker: string) {
  try {
    const res = await fetch(`${BASE_URL}/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`);
    const data = await res.json();
    
    // Finnhub returns 0s if the ticker is invalid
    if (!data || (data.c === 0 && data.d === null)) return null;

    return {
      currentPrice: data.c,
      change: data.d,
      percentChange: data.dp,
    };
  } catch (error) {
    console.error('Error fetching quote for', ticker, error);
    return null;
  }
}

export async function fetchCandles(ticker: string) {
  try {
    // Generate timestamps for exactly 1 month
    const to = Math.floor(Date.now() / 1000);
    const from = to - (30 * 24 * 60 * 60);

    const res = await fetch(`${BASE_URL}/stock/candle?symbol=${ticker}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`);
    const data = await res.json();

    if (data.s !== "ok" || !data.c) return [];
    
    // Map close prices (c)
    return data.c.map((price: number) => ({ value: price }));
  } catch (error) {
    console.error('Error fetching candles for', ticker, error);
    return [];
  }
}
