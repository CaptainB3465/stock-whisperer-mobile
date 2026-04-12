import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useAlerts } from '@/context/AlertsContext';
import { fetchQuote } from '@/services/api/stocks';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function useAlertChecker() {
  const { alerts, markTriggered } = useAlerts();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const check = async () => {
      const activeAlerts = alerts.filter(a => !a.triggered);
      if (activeAlerts.length === 0) return;

      // Deduplicate tickers
      const tickers = [...new Set(activeAlerts.map(a => a.ticker))];
      const quotes = await Promise.all(
        tickers.map(async t => ({ ticker: t, quote: await fetchQuote(t) }))
      );
      const quoteMap = Object.fromEntries(quotes.map(q => [q.ticker, q.quote]));

      for (const alert of activeAlerts) {
        const quote = quoteMap[alert.ticker];
        if (!quote) continue;

        let triggered = false;
        let message = '';

        if (alert.condition === 'above' && quote.currentPrice >= alert.value) {
          triggered = true;
          message = `${alert.ticker} crossed above $${alert.value} — now $${quote.currentPrice.toFixed(2)}`;
        } else if (alert.condition === 'below' && quote.currentPrice <= alert.value) {
          triggered = true;
          message = `${alert.ticker} fell below $${alert.value} — now $${quote.currentPrice.toFixed(2)}`;
        } else if (alert.condition === 'pct_change' && Math.abs(quote.percentChange) >= alert.value) {
          triggered = true;
          message = `${alert.ticker} moved ${quote.percentChange > 0 ? '+' : ''}${quote.percentChange.toFixed(2)}% (alert: ${alert.value}%)`;
        }

        if (triggered) {
          await markTriggered(alert.id);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '🔔 Stock Alert Triggered',
              body: message,
              sound: true,
            },
            trigger: null, // Fire immediately
          });
        }
      }
    };

    check();
    intervalRef.current = setInterval(check, 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [alerts]);
}
