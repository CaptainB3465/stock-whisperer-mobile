import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useWatchlist } from '@/context/WatchlistContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { fetchCandles } from '@/services/finnhub';
import StockChart from '@/components/StockChart';

export default function ModalScreen() {
  const { ticker, price, changePercent } = useLocalSearchParams();
  const { colors } = useTheme();
  const { isInWatchlist, addTicker, removeTicker } = useWatchlist();
  const { isProUser } = useSubscription();
  const router = useRouter();

  const [data, setData] = useState<{ value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const tickerStr = ticker as string;
  const isPositive = Number(changePercent) >= 0;
  const inWatchlist = isInWatchlist(tickerStr);

  useEffect(() => {
    async function loadData() {
      if (!tickerStr) return;
      const chartData = await fetchCandles(tickerStr);
      setData(chartData);
      setLoading(false);
    }
    loadData();
  }, [tickerStr]);

  const toggleWatchlist = async () => {
    if (inWatchlist) {
      await removeTicker(tickerStr);
    } else {
      await addTicker(tickerStr);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{tickerStr}</Text>
          <Text style={[styles.subtitle, { color: colors.subText }]}>
            ${Number(price).toFixed(2)}{' '}
            <Text style={{ color: isPositive ? '#34C759' : '#FF3B30' }}>
              {isPositive ? '▲' : '▼'} {Math.abs(Number(changePercent)).toFixed(2)}%
            </Text>
          </Text>
        </View>
        <Pressable
          onPress={toggleWatchlist}
          style={({ pressed }) => [
            styles.watchBtn,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.watchBtnText, { color: inWatchlist ? '#34C759' : colors.text }]}>
            {inWatchlist ? '★ Saved' : '☆ Watch'}
          </Text>
        </Pressable>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.text} />
        ) : data.length > 0 ? (
          <StockChart data={data} isPositive={isPositive} />
        ) : (
          <Text style={{ color: colors.subText, textAlign: 'center' }}>
            No chart data available.
          </Text>
        )}
      </View>

      {/* AI Insights - PRO ONLY */}
      {isProUser ? (
        <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.insightTitle, { color: colors.text }]}>🧠 Whisperer AI Insights</Text>

          <View style={styles.insightRow}>
            <Text style={[styles.insightLabel, { color: colors.subText }]}>Social Sentiment</Text>
            <Text style={[styles.insightValue, { color: '#34C759' }]}>Extremely Bullish (89%)</Text>
          </View>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <View style={styles.insightRow}>
            <Text style={[styles.insightLabel, { color: colors.subText }]}>Dark Pool Index</Text>
            <Text style={[styles.insightValue, { color: colors.text }]}>High Accumulation</Text>
          </View>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <View style={styles.insightRow}>
            <Text style={[styles.insightLabel, { color: colors.subText }]}>MoneyStream Signal</Text>
            <Text style={[styles.insightValue, { color: '#34C759' }]}>↑ Inflow Detected</Text>
          </View>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <View style={styles.insightRow}>
            <Text style={[styles.insightLabel, { color: colors.subText }]}>Volume Buzz</Text>
            <Text style={[styles.insightValue, { color: '#FF9F0A' }]}>Elevated (+42% avg)</Text>
          </View>
        </View>
      ) : (
        /* Locked State — no content rendered, just upgrade prompt */
        <View style={[styles.lockedCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={[styles.lockTitle, { color: colors.text }]}>AI Insights Locked</Text>
          <Text style={[styles.lockSub, { color: colors.subText }]}>
            Upgrade to PRO to unlock Dark Pool signals, MoneyStream readings, and AI sentiment analysis for {tickerStr}.
          </Text>

          {/* Blurred preview rows */}
          <View style={[styles.blurPreview, { borderColor: colors.border }]}>
            <Text style={styles.blurRow}>Social Sentiment    ████████████</Text>
            <Text style={styles.blurRow}>Dark Pool Index     ████████████</Text>
            <Text style={styles.blurRow}>MoneyStream Signal  ████████████</Text>
            <Text style={styles.blurRow}>Volume Buzz         ████████████</Text>
          </View>

          <Pressable
            onPress={() => router.push('/paywall')}
            style={({ pressed }) => [styles.upgradeBtn, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Text style={styles.upgradeBtnText}>Upgrade to PRO</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  title: { fontSize: 30, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 4 },
  watchBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  watchBtnText: { fontSize: 14, fontWeight: '700' },
  chartContainer: { justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  insightCard: { borderRadius: 16, borderWidth: 1, padding: 20 },
  insightTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  insightRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  insightLabel: { fontSize: 14 },
  insightValue: { fontSize: 14, fontWeight: 'bold' },
  separator: { height: 1 },
  lockedCard: { borderRadius: 16, borderWidth: 1, padding: 24, alignItems: 'center' },
  lockIcon: { fontSize: 40, marginBottom: 12 },
  lockTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  lockSub: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  blurPreview: { width: '100%', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 20 },
  blurRow: { color: '#444', fontFamily: 'monospace', fontSize: 12, marginBottom: 6 },
  upgradeBtn: { backgroundColor: '#34C759', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 100 },
  upgradeBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
