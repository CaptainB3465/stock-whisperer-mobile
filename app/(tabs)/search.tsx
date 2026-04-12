import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/ThemeContext';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { fetchQuote } from '@/services/api/stocks';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const router = useRouter();

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const quote = await fetchQuote(query.toUpperCase());
      if (quote) {
        router.push({ 
          pathname: '/modal', 
          params: { 
            ticker: query.toUpperCase(), 
            price: quote.currentPrice, 
            changePercent: quote.percentChange 
          }
        });
      } else {
        alert('Ticker not found or API limit reached.');
      }
    } catch (e) {
      alert('Search failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Search Assets</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.subText} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Type ticker symbol (e.g. MSFT)..."
            placeholderTextColor={colors.subText}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="characters"
            onSubmitEditing={handleSearch}
          />
        </View>
        <View style={styles.emptyState}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.text} />
          ) : (
            <Text style={[styles.emptyStateText, { color: colors.subText }]}>Enter a valid stock ticker symbol to analyze.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
