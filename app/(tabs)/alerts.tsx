import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/context/ThemeContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

const MOCK_PRINTS = [
  { id: 1, ticker: 'SPY', type: 'Late Print', shares: '2.5M', price: 512.43, bullish: 513, bearish: 512, time: '10:02 AM' },
  { id: 2, ticker: 'NVDA', type: 'Block Trade', shares: '850K', price: 875.10, bullish: 878, bearish: 870, time: '11:45 AM' },
  { id: 3, ticker: 'TSLA', type: 'Dark Pool', shares: '1.2M', price: 172.50, bullish: 175, bearish: 170, time: '1:15 PM' },
  { id: 4, ticker: 'QQQ', type: 'Signature Print', shares: '3.1M', price: 440.20, bullish: 442, bearish: 438, time: '2:30 PM' },
];

export default function AlertsScreen() {
  const { colors, theme } = useTheme();
  const { isProUser } = useSubscription();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Dark Pool Prints</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Real-time institutional volume levels</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {MOCK_PRINTS.map((print) => (
          <View key={print.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.ticker, { color: colors.text }]}>{print.ticker}</Text>
              <Text style={[styles.time, { color: colors.subText }]}>{print.time}</Text>
            </View>
            <Text style={[styles.type, { color: '#34C759' }]}>{print.type}</Text>
            
            <View style={styles.dataRow}>
              <View>
                <Text style={[styles.label, { color: colors.subText }]}>Shares</Text>
                <Text style={[styles.value, { color: colors.text }]}>{print.shares}</Text>
              </View>
              <View>
                <Text style={[styles.label, { color: colors.subText }]}>Price</Text>
                <Text style={[styles.value, { color: colors.text }]}>${print.price}</Text>
              </View>
            </View>

            <View style={styles.levelRow}>
              <Text style={styles.bullish}>Bullish {'>'} {print.bullish}</Text>
              <Text style={styles.bearish}>Bearish {'<'} {print.bearish}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {!isProUser && (
        <View style={[StyleSheet.absoluteFill, styles.lockOverlay]}>
          <BlurView intensity={theme === 'dark' ? 80 : 50} tint={theme === 'dark' ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, styles.blurView]}>
            <IconSymbol name="bell.fill" size={48} color={colors.text} style={{marginBottom: 16}} />
            <Text style={[styles.lockTitle, { color: colors.text }]}>Dark Pool Access Locked</Text>
            <Text style={[styles.lockSub, { color: colors.text }]}>Subscribe to PRO to see the exact levels where institutions are parking their money.</Text>
            <Pressable 
              onPress={() => router.push('/paywall')} 
              style={({pressed}) => [styles.upgradeBtn, { opacity: pressed ? 0.8 : 1 }]}
            >
              <Text style={styles.upgradeBtnText}>Upgrade to PRO</Text>
            </Pressable>
          </BlurView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  container: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ticker: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  bullish: {
    color: '#34C759',
    fontWeight: 'bold',
  },
  bearish: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  lockOverlay: {
    zIndex: 10,
  },
  blurView: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lockSub: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeBtn: {
    backgroundColor: '#34C759',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 100,
  },
  upgradeBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
