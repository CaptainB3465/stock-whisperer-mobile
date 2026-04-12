/**
 * @fileoverview Finnhub API service for real-time stock market data.
 * API key is stored in .env and is gitignored - safe for local Expo Go development.
 */

const FINNHUB_API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY || '';
const BASE_URL = 'https://finnhub.io/api/v1';

export async function fetchQuote(ticker: string) {
  try {
    const res = await fetch(`${BASE_URL}/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`);
    const data = await res.json();

    // Finnhub returns 0s for invalid tickers
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
    const to = Math.floor(Date.now() / 1000);
    const from = to - 30 * 24 * 60 * 60; // 30 days back

    const res = await fetch(
      `${BASE_URL}/stock/candle?symbol=${ticker}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    const data = await res.json();

    if (data.s !== 'ok' || !data.c) return [];

    // Map daily close prices
    return data.c.map((price: number) => ({ value: price }));
  } catch (error) {
    console.error('Error fetching candles for', ticker, error);
    return [];
  }
}
