import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PortfolioSummaryProps {
  balance: number;
  dailyChange: number;
  dailyChangePercent: number;
}

export default function PortfolioSummary({ balance, dailyChange, dailyChangePercent }: PortfolioSummaryProps) {
  const isPositive = dailyChange >= 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total Balance</Text>
      <Text style={styles.balance}>${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
      <View style={styles.row}>
        <Text style={[styles.changeLabel, isPositive ? styles.positiveText : styles.negativeText]}>
          {isPositive ? '+' : ''}{dailyChange.toFixed(2)} ({isPositive ? '+' : ''}{dailyChangePercent.toFixed(2)}%)
        </Text>
        <Text style={styles.todayLabel}> Today</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  label: {
    color: '#A0A0A0',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  todayLabel: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  positiveText: {
    color: '#34C759',
  },
  negativeText: {
    color: '#FF3B30',
  },
});
