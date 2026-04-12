import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import PortfolioSummary from '@/components/PortfolioSummary';
import StockCard from '@/components/StockCard';
import { useTheme } from '@/context/ThemeContext';
import { useWatchlist } from '@/context/WatchlistContext';
import { useAuth } from '@/context/AuthContext';
import { fetchQuote } from '@/services/finnhub';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { watchlist, isLoaded: watchlistLoaded } = useWatchlist();
  const { user } = useAuth();
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    async function loadWatchlistStocks() {
      if (!watchlistLoaded) return;
      if (watchlist.length === 0) {
        setStocks([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const results = await Promise.all(
        watchlist.map(async (ticker) => {
          const quote = await fetchQuote(ticker);
          if (quote) {
            return { ticker, price: quote.currentPrice, change: quote.change, changePercent: quote.percentChange };
          }
          return null;
        })
      );
      setStocks(results.filter(Boolean));
      setLoading(false);
    }
    loadWatchlistStocks();
  }, [watchlist, watchlistLoaded]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>{getGreeting()}, {user?.name ?? 'Member'} 👋</Text>
          <Text style={[styles.subtitle, { color: colors.subText }]}>Let's see how your stocks are doing</Text>
        </View>

        <PortfolioSummary 
          balance={12450.75} 
          dailyChange={345.20} 
          dailyChangePercent={2.85} 
        />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Watchlist 📈</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.text} />
        ) : stocks.length === 0 ? (
          <Text style={[{ color: colors.subText, textAlign: 'center', marginTop: 20 }]}>
            Your watchlist is empty. Go to Search to add some assets!
          </Text>
        ) : (
          stocks.map((stock) => (
            <StockCard 
              key={stock.ticker}
              ticker={stock.ticker}
              price={stock.price}
              change={stock.change}
              changePercent={stock.changePercent}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingTop: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  sectionHeader: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
