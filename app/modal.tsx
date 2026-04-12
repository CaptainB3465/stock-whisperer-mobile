import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/context/ThemeContext';
import { useWatchlist } from '@/context/WatchlistContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { fetchCandles } from '@/services/finnhub';
import StockChart from '@/components/StockChart';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ModalScreen() {
  const { ticker, price, changePercent } = useLocalSearchParams();
  const { colors, theme } = useTheme();
  const { isInWatchlist, addTicker, removeTicker } = useWatchlist();
  const { isProUser } = useSubscription();
  const router = useRouter();
  
  const [data, setData] = useState<{value: number}[]>([]);
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ padding: 24 }}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{tickerStr} Analysis</Text>
          <Text style={[styles.subtitle, { color: colors.subText }]}>Current Price: ${Number(price).toFixed(2)}</Text>
        </View>
        <Pressable 
          onPress={toggleWatchlist} 
          style={({pressed}) => [styles.watchBtn, { backgroundColor: colors.card, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.watchBtnText, { color: inWatchlist ? colors.subText : colors.text }]}>
            {inWatchlist ? '★ Saved' : '☆ Add to Watchlist'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.chartContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.text} />
        ) : data.length > 0 ? (
          <StockChart data={data} isPositive={isPositive} />
        ) : (
          <Text style={{ color: colors.subText }}>No chart data available for the last month.</Text>
        )}
      </View>

      {/* Freemium Section */}
      <View style={[styles.premiumContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.premiumHeader}>
          <Text style={[styles.premiumTitle, { color: colors.text }]}>Whisperer AI Insights</Text>
        </View>
        
        <View style={styles.insightRow}>
          <Text style={[styles.insightLabel, { color: colors.subText }]}>Social Sentiment</Text>
          <Text style={[styles.insightValue, { color: '#34C759' }]}>Extremely Bullish (89%)</Text>
        </View>
        <View style={styles.insightRow}>
          <Text style={[styles.insightLabel, { color: colors.subText }]}>Dark Pool Index</Text>
          <Text style={[styles.insightValue, { color: colors.text }]}>High Accumulation</Text>
        </View>

        {!isProUser && (
          <View style={[StyleSheet.absoluteFill, styles.lockOverlay]}>
            <BlurView intensity={theme === 'dark' ? 80 : 50} tint={theme === 'dark' ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, styles.blurView]}>
              <IconSymbol name="briefcase.fill" size={32} color={colors.text} style={{marginBottom: 12}} />
              <Text style={[styles.lockTitle, { color: colors.text }]}>Unlock Pro Insights</Text>
              <Text style={[styles.lockSub, { color: colors.text }]}>See the hidden data moving the markets.</Text>
              <Pressable 
                onPress={() => router.push('/paywall')} 
                style={({pressed}) => [styles.upgradeBtn, { opacity: pressed ? 0.8 : 1 }]}
              >
                <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
              </Pressable>
            </BlurView>
          </View>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 8,
  },
  watchBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  premiumContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 180,
  },
  premiumHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 14,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lockOverlay: {
    zIndex: 10,
  },
  blurView: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lockSub: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeBtn: {
    backgroundColor: '#34C759',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  upgradeBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
