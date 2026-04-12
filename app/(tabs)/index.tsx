import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, RefreshControl } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useWatchlist } from '@/context/WatchlistContext';
import { useAuth } from '@/context/AuthContext';
import { useAlertChecker } from '@/hooks/useAlertChecker';
import { useWatchlistData } from '@/hooks/useWatchlistData';
import { StockCard } from '@/components/StockCard';
import { SkeletonLoader } from '@/components/SkeletonLoader';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { watchlist } = useWatchlist();
  const { user } = useAuth();
  const [sortMode, setSortMode] = useState<'gainers' | 'losers' | 'default'>('gainers');
  const [refreshing, setRefreshing] = useState(false);

  // Background alert checking
  useAlertChecker();

  const { stocks, refresh } = useWatchlistData(watchlist, sortMode);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const gainersCount = useMemo(() => stocks.filter(s => s.quote && s.quote.percentChange > 0).length, [stocks]);
  const losersCount = useMemo(() => stocks.filter(s => s.quote && s.quote.percentChange < 0).length, [stocks]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>{getGreeting()}, {user?.name ?? 'Member'} 👋</Text>
          <Text style={[styles.subtitle, { color: colors.subText }]}>Let's see how your stocks are doing</Text>
        </View>

        {/* Market Summary */}
        {stocks.some(s => s.quote) && (
          <View style={[styles.summaryRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.subText }]}>Gainers</Text>
              <Text style={[styles.summaryValue, { color: '#34C759' }]}>▲ {gainersCount}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.subText }]}>Losers</Text>
              <Text style={[styles.summaryValue, { color: '#FF3B30' }]}>▼ {losersCount}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.subText }]}>Tracked</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{stocks.length}</Text>
            </View>
          </View>
        )}

        {/* Watchlist Header + Sort */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Watchlist 📈</Text>
          <View style={styles.sortRow}>
            {(['gainers', 'losers', 'default'] as const).map(mode => (
              <Pressable
                key={mode}
                onPress={() => setSortMode(mode)}
                style={[
                  styles.sortBtn,
                  {
                    backgroundColor: sortMode === mode ? colors.text : colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.sortText, { color: sortMode === mode ? colors.background : colors.subText }]}>
                  {mode === 'gainers' ? '▲ Gainers' : mode === 'losers' ? '▼ Losers' : 'Default'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {stocks.length === 0 ? (
          <Text style={[styles.empty, { color: colors.subText }]}>
            Your watchlist is empty. Search for stocks to add them!
          </Text>
        ) : (
          stocks.map(stock =>
            stock.loading ? (
              <SkeletonLoader key={stock.ticker} />
            ) : (
              <StockCard key={stock.ticker} ticker={stock.ticker} quote={stock.quote} />
            )
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 16, paddingTop: 40, paddingBottom: 40 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 4 },
  summaryRow: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
  },
  summaryItem: { flex: 1, alignItems: 'center', padding: 14 },
  summaryLabel: { fontSize: 12, marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: 'bold' },
  summaryDivider: { width: 1 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  sortRow: { flexDirection: 'row', gap: 8 },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  sortText: { fontSize: 12, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16 },
});
