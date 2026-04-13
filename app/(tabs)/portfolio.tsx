import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { StockCard } from '@/components/StockCard';
import { fetchQuote } from '@/services/api/stocks';

const PORTFOLIO_TICKERS = ['AAPL', 'AMZN'];

export default function PortfolioScreen() {
  const { colors } = useTheme();
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      const results = await Promise.all(
        PORTFOLIO_TICKERS.map(async (ticker) => {
          const quote = await fetchQuote(ticker);
          return { ticker, quote };
        })
      );
      setStocks(results);
      setLoading(false);
    }
    loadPortfolio();
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Your Portfolio</Text>
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Holdings</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.text} />
        ) : (
          stocks.map((stock) => (
            <StockCard 
              key={stock.ticker}
              ticker={stock.ticker}
              quote={stock.quote}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 16, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  sectionHeader: { marginVertical: 16 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold' },
});
