/**
 * Whisper Signal Engine
 * Analyzes an array of close prices and produces:
 * - signal: 'bullish' | 'bearish' | 'neutral'
 * - confidence: 0–100
 * - explanation: human-readable reasoning
 */

export type SignalType = 'bullish' | 'bearish' | 'neutral';

export interface WhisperSignal {
  signal: SignalType;
  confidence: number;
  explanation: string;
  trend: string;
  volatility: 'low' | 'medium' | 'high';
  momentum: number; // Rate of Change %
}

function sma(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] ?? 0;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function stdDev(prices: number[]): number {
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + (p - mean) ** 2, 0) / prices.length;
  return Math.sqrt(variance);
}

function roc(prices: number[], period: number): number {
  if (prices.length < period + 1) return 0;
  const prev = prices[prices.length - period - 1];
  const curr = prices[prices.length - 1];
  return ((curr - prev) / prev) * 100;
}

export function analyzeSignal(closePrices: number[]): WhisperSignal {
  if (!closePrices || closePrices.length < 5) {
    return {
      signal: 'neutral',
      confidence: 0,
      explanation: 'Not enough historical data for analysis.',
      trend: 'Insufficient data',
      volatility: 'low',
      momentum: 0,
    };
  }

  const shortMA = sma(closePrices, 5);
  const longMA = sma(closePrices, Math.min(20, closePrices.length));
  const momentum = roc(closePrices, Math.min(5, closePrices.length - 1));
  const std = stdDev(closePrices.slice(-10));
  const currentPrice = closePrices[closePrices.length - 1];
  const avgPrice = sma(closePrices, closePrices.length);

  // Volatility classification
  const volatilityPct = (std / avgPrice) * 100;
  const volatility: 'low' | 'medium' | 'high' =
    volatilityPct < 1 ? 'low' : volatilityPct < 3 ? 'medium' : 'high';

  // Scoring signals (each max 33 points)
  let score = 50; // start neutral
  const reasons: string[] = [];

  // MA crossover signal
  if (shortMA > longMA) {
    score += 20;
    reasons.push(`Short MA (${shortMA.toFixed(2)}) above Long MA — uptrend`);
  } else if (shortMA < longMA) {
    score -= 20;
    reasons.push(`Short MA below Long MA — downtrend`);
  }

  // Momentum signal
  if (momentum > 3) {
    score += 15;
    reasons.push(`Strong momentum +${momentum.toFixed(1)}%`);
  } else if (momentum > 0) {
    score += 7;
    reasons.push(`Mild positive momentum +${momentum.toFixed(1)}%`);
  } else if (momentum < -3) {
    score -= 15;
    reasons.push(`Declining momentum ${momentum.toFixed(1)}%`);
  } else if (momentum < 0) {
    score -= 7;
    reasons.push(`Mild negative momentum ${momentum.toFixed(1)}%`);
  }

  // Volatility spike bonus
  if (volatility === 'high' && momentum > 0) {
    score += 10;
    reasons.push('High volume volatility + upward price surge = momentum');
  } else if (volatility === 'high' && momentum < 0) {
    score -= 10;
    reasons.push('High volatility + falling price = selling pressure');
  }

  const confidence = Math.min(100, Math.max(0, score));
  const signal: SignalType =
    confidence >= 60 ? 'bullish' : confidence <= 40 ? 'bearish' : 'neutral';

  const trendLabel =
    shortMA > longMA ? 'Uptrend' : shortMA < longMA ? 'Downtrend' : 'Sideways';

  return {
    signal,
    confidence: Math.round(confidence),
    explanation: reasons.join(' · '),
    trend: trendLabel,
    volatility,
    momentum: parseFloat(momentum.toFixed(2)),
  };
}
