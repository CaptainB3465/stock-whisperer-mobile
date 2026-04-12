import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

interface StockCardProps {
  ticker: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function StockCard({ ticker, name, price, change, changePercent }: StockCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const isPositive = change >= 0;
  
  return (
    <Pressable 
      onPress={() => router.push({ pathname: '/modal', params: { ticker, price, changePercent }})}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 }
      ]}
    >
      <View style={styles.leftCol}>
        <Text style={[styles.ticker, { color: colors.text }]}>{ticker}</Text>
        {name && <Text style={[styles.name, { color: colors.subText }]}>{name}</Text>}
      </View>
      <View style={styles.rightCol}>
        <Text style={[styles.price, { color: colors.text }]}>${price.toFixed(2)}</Text>
        <View style={[styles.badge, { backgroundColor: isPositive ? colors.badgePositive : colors.badgeNegative }]}>
          <Text style={[styles.changeText, isPositive ? styles.positiveText : styles.negativeText]}>
            {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  leftCol: {
    flex: 1,
  },
  ticker: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    marginTop: 4,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
  },
  badge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  positiveText: {
    color: '#34C759',
  },
  negativeText: {
    color: '#FF3B30',
  },
});
