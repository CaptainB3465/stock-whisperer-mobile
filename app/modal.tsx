import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  ActivityIndicator, Modal, TextInput, Alert as RNAlert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useWatchlist } from '@/context/WatchlistContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useAlerts } from '@/context/AlertsContext';
import { fetchCandles } from '@/services/api/stocks';
import { analyzeSignal, WhisperSignal } from '@/services/whisperEngine';
import StockChart from '@/components/StockChart';

type TimeRange = '1W' | '1M' | '3M';
const RANGES: { label: TimeRange; days: number }[] = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
];

export default function ModalScreen() {
  const { ticker, price, changePercent } = useLocalSearchParams();
  const { colors } = useTheme();
  const { isInWatchlist, addTicker, removeTicker } = useWatchlist();
  const { isProUser } = useSubscription();
  const { addAlert } = useAlerts();
  const router = useRouter();

  const tickerStr = ticker as string;
  const isPositive = Number(changePercent) >= 0;
  const inWatchlist = isInWatchlist(tickerStr);

  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');
  const [allCandles, setAllCandles] = useState<{ value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [signal, setSignal] = useState<WhisperSignal | null>(null);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertValue, setAlertValue] = useState('');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below' | 'pct_change'>('above');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchCandles(tickerStr, 'D', 90);
      setAllCandles(data);
      const sig = analyzeSignal(data.map(d => d.value));
      setSignal(sig);
      setLoading(false);
    };
    load();
  }, [tickerStr]);

  const displayedCandles = useMemo(() => {
    const range = RANGES.find(r => r.label === selectedRange)!;
    return allCandles.slice(-range.days);
  }, [allCandles, selectedRange]);

  const toggleWatchlist = useCallback(async () => {
    if (inWatchlist) await removeTicker(tickerStr);
    else await addTicker(tickerStr);
  }, [inWatchlist, tickerStr]);

  const handleAddAlert = async () => {
    const val = parseFloat(alertValue);
    if (isNaN(val)) { RNAlert.alert('Error', 'Please enter a valid number.'); return; }
    await addAlert({ ticker: tickerStr, condition: alertCondition, value: val });
    setAlertModalVisible(false);
    RNAlert.alert('Alert Set', `You'll be notified when ${tickerStr} is ${alertCondition} ${val}`);
  };

  const signalColor = signal?.signal === 'bullish' ? '#34C759' : signal?.signal === 'bearish' ? '#FF3B30' : '#FF9F0A';
  const signalEmoji = signal?.signal === 'bullish' ? '🟢' : signal?.signal === 'bearish' ? '🔴' : '🟡';

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
          style={({ pressed }) => [styles.watchBtn, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.watchBtnText, { color: inWatchlist ? '#34C759' : colors.text }]}>
            {inWatchlist ? '★ Saved' : '☆ Watch'}
          </Text>
        </Pressable>
      </View>

      {/* Time Range Selector */}
      <View style={styles.rangeRow}>
        {RANGES.map(r => (
          <Pressable
            key={r.label}
            onPress={() => setSelectedRange(r.label)}
            style={[
              styles.rangeBtn,
              {
                backgroundColor: selectedRange === r.label ? colors.text : colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.rangeBtnText, { color: selectedRange === r.label ? colors.background : colors.subText }]}>
              {r.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.text} />
        ) : displayedCandles.length > 0 ? (
          <StockChart data={displayedCandles} isPositive={isPositive} />
        ) : (
          <Text style={{ color: colors.subText }}>No chart data available.</Text>
        )}
      </View>

      {/* Set Alert Button */}
      <Pressable
        onPress={() => setAlertModalVisible(true)}
        style={({ pressed }) => [styles.alertBtn, { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed ? 0.7 : 1 }]}
      >
        <Text style={[styles.alertBtnText, { color: colors.text }]}>🔔 Set Price Alert</Text>
      </Pressable>

      {/* Whisper Signal Engine */}
      {isProUser ? (
        signal && (
          <View style={[styles.signalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.signalHeader, { color: colors.text }]}>🧠 Whisper Signal Engine</Text>

            {/* Signal badge */}
            <View style={[styles.signalBadge, { backgroundColor: `${signalColor}22`, borderColor: `${signalColor}55` }]}>
              <Text style={[styles.signalBadgeText, { color: signalColor }]}>
                {signalEmoji} {signal.signal.toUpperCase()} — {signal.confidence}% Confidence
              </Text>
            </View>

            <View style={styles.metricGrid}>
              <MetricRow label="Trend" value={signal.trend} colors={colors} />
              <MetricRow label="Momentum" value={`${signal.momentum > 0 ? '+' : ''}${signal.momentum}%`} colors={colors} valueColor={signal.momentum > 0 ? '#34C759' : '#FF3B30'} />
              <MetricRow label="Volatility" value={signal.volatility.charAt(0).toUpperCase() + signal.volatility.slice(1)} colors={colors} />
            </View>

            <View style={[styles.explanationBox, { backgroundColor: colors.background }]}>
              <Text style={[styles.explanationLabel, { color: colors.subText }]}>Signal Explanation</Text>
              <Text style={[styles.explanationText, { color: colors.text }]}>{signal.explanation || 'Insufficient data for explanation.'}</Text>
            </View>
          </View>
        )
      ) : (
        <View style={[styles.lockedCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={[styles.lockTitle, { color: colors.text }]}>AI Insights Locked</Text>
          <Text style={[styles.lockSub, { color: colors.subText }]}>
            Upgrade to PRO to unlock Whisper Signal Engine, Dark Pool signals, and MoneyStream readings for {tickerStr}.
          </Text>
          <View style={[styles.blurPreview, { borderColor: colors.border }]}>
            <Text style={styles.blurRow}>Trend              ████████████</Text>
            <Text style={styles.blurRow}>Momentum           ████████████</Text>
            <Text style={styles.blurRow}>Confidence Score   ████████████</Text>
          </View>
          <Pressable onPress={() => router.push('/paywall')} style={({ pressed }) => [styles.upgradeBtn, { opacity: pressed ? 0.8 : 1 }]}>
            <Text style={styles.upgradeBtnText}>Upgrade to PRO</Text>
          </Pressable>
        </View>
      )}

      {/* Alert Modal */}
      <Modal visible={alertModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.alertModalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.alertModalHeader}>
            <Pressable onPress={() => setAlertModalVisible(false)}>
              <Text style={{ color: colors.subText }}>Cancel</Text>
            </Pressable>
            <Text style={[styles.alertModalTitle, { color: colors.text }]}>Set Alert for {tickerStr}</Text>
            <Pressable onPress={handleAddAlert}>
              <Text style={{ color: '#34C759', fontWeight: 'bold' }}>Save</Text>
            </Pressable>
          </View>
          <View style={styles.alertModalBody}>
            <Text style={[styles.alertLabel, { color: colors.text }]}>Condition</Text>
            <View style={styles.conditionRow}>
              {(['above', 'below', 'pct_change'] as const).map(c => (
                <Pressable
                  key={c}
                  onPress={() => setAlertCondition(c)}
                  style={[
                    styles.conditionBtn,
                    { backgroundColor: alertCondition === c ? colors.text : colors.card, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.conditionText, { color: alertCondition === c ? colors.background : colors.subText }]}>
                    {c === 'above' ? 'Price Above' : c === 'below' ? 'Price Below' : '% Change'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={[styles.alertLabel, { color: colors.text }]}>
              {alertCondition === 'pct_change' ? 'Percentage (%)' : 'Price ($)'}
            </Text>
            <TextInput
              style={[styles.alertInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder={alertCondition === 'pct_change' ? 'e.g. 3' : 'e.g. 180.00'}
              placeholderTextColor={colors.subText}
              keyboardType="numeric"
              value={alertValue}
              onChangeText={setAlertValue}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function MetricRow({ label, value, colors, valueColor }: { label: string; value: string; colors: any; valueColor?: string }) {
  return (
    <View style={styles.metricRow}>
      <Text style={[styles.metricLabel, { color: colors.subText }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: valueColor ?? colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 30, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 4 },
  watchBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  watchBtnText: { fontSize: 14, fontWeight: '700' },
  rangeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  rangeBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  rangeBtnText: { fontSize: 13, fontWeight: '600' },
  chartContainer: { justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  alertBtn: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
  alertBtnText: { fontSize: 16, fontWeight: '600' },
  signalCard: { borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 16 },
  signalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  signalBadge: { borderRadius: 12, borderWidth: 1, padding: 12, alignItems: 'center', marginBottom: 16 },
  signalBadgeText: { fontSize: 16, fontWeight: 'bold' },
  metricGrid: { marginBottom: 16 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#333' },
  metricLabel: { fontSize: 14 },
  metricValue: { fontSize: 14, fontWeight: 'bold' },
  explanationBox: { borderRadius: 10, padding: 14 },
  explanationLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 6 },
  explanationText: { fontSize: 14, lineHeight: 20 },
  lockedCard: { borderRadius: 16, borderWidth: 1, padding: 24, alignItems: 'center' },
  lockIcon: { fontSize: 40, marginBottom: 12 },
  lockTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  lockSub: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  blurPreview: { width: '100%', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 20 },
  blurRow: { color: '#444', fontFamily: 'monospace', fontSize: 12, marginBottom: 6 },
  upgradeBtn: { backgroundColor: '#34C759', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 100 },
  upgradeBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  alertModalContainer: { flex: 1, padding: 24, paddingTop: 40 },
  alertModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  alertModalTitle: { fontSize: 18, fontWeight: 'bold' },
  alertModalBody: {},
  alertLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  conditionRow: { flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  conditionBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  conditionText: { fontSize: 13, fontWeight: '600' },
  alertInput: { padding: 16, borderRadius: 12, borderWidth: 1, fontSize: 18, marginBottom: 8 },
});
