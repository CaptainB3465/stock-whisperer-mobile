import React, { memo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useWatchlist } from '@/context/WatchlistContext';
import { StockQuote } from '@/services/api/stocks';
import { Alert } from 'react-native';

interface StockCardProps {
  ticker: string;
  quote: StockQuote | null;
}

export const StockCard = memo(function StockCard({ ticker, quote }: StockCardProps) {
  const { colors } = useTheme();
  const { removeTicker } = useWatchlist();
  const router = useRouter();
  const flashAnim = useRef(new Animated.Value(0)).current;
  const prevPrice = useRef<number | null>(null);

  const isPositive = (quote?.percentChange ?? 0) >= 0;
  const isHot = Math.abs(quote?.percentChange ?? 0) >= 2;

  useEffect(() => {
    if (quote && prevPrice.current !== null && prevPrice.current !== quote.currentPrice) {
      // Flash on price change
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
        Animated.timing(flashAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
      ]).start();
    }
    if (quote) prevPrice.current = quote.currentPrice;
  }, [quote?.currentPrice]);

  const flashColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', isPositive ? 'rgba(52,199,89,0.15)' : 'rgba(255,59,48,0.15)'],
  });

  const handlePress = () => {
    if (!quote) return;
    router.push({
      pathname: '/modal',
      params: {
        ticker,
        price: quote.currentPrice,
        changePercent: quote.percentChange,
      },
    });
  };

  const handleLongPress = () => {
    Alert.alert(
      'Remove from Watchlist',
      `Are you sure you want to remove ${ticker}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeTicker(ticker) },
      ]
    );
  };

  return (
    <Pressable 
      onPress={handlePress} 
      onLongPress={handleLongPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <Animated.View style={[styles.card, { backgroundColor: flashColor, borderColor: colors.border }]}>
        <View style={styles.inner}>
          <View style={[styles.bg, { backgroundColor: colors.card }]} />
          <View style={styles.left}>
            <View style={styles.tickerRow}>
              <Text style={[styles.ticker, { color: colors.text }]}>{ticker}</Text>
              {isHot && <View style={styles.hotBadge}><Text style={styles.hotText}>🔥 HOT</Text></View>}
            </View>
            {quote ? (
              <Text style={[styles.details, { color: colors.subText }]}>
                H: ${quote.high.toFixed(2)}  L: ${quote.low.toFixed(2)}
              </Text>
            ) : (
              <Text style={[styles.details, { color: colors.subText }]}>Loading...</Text>
            )}
          </View>
          <View style={styles.right}>
            {quote ? (
              <>
                <Text style={[styles.price, { color: colors.text }]}>${quote.currentPrice.toFixed(2)}</Text>
                <View style={[styles.badge, { backgroundColor: isPositive ? 'rgba(52,199,89,0.15)' : 'rgba(255,59,48,0.15)' }]}>
                  <Text style={[styles.change, { color: isPositive ? '#34C759' : '#FF3B30' }]}>
                    {isPositive ? '▲' : '▼'} {Math.abs(quote.percentChange).toFixed(2)}%
                  </Text>
                </View>
              </>
            ) : (
              <Text style={[styles.price, { color: colors.subText }]}>—</Text>
            )}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  left: { flex: 1 },
  right: { alignItems: 'flex-end' },
  tickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  ticker: { fontSize: 20, fontWeight: 'bold' },
  hotBadge: { backgroundColor: 'rgba(255,159,10,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  hotText: { fontSize: 11, fontWeight: 'bold', color: '#FF9F0A' },
  details: { fontSize: 13 },
  price: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  change: { fontSize: 14, fontWeight: 'bold' },
});
