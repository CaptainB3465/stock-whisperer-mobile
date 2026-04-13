import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useTheme } from '@/context/ThemeContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useAdmin } from '@/context/AdminContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

function LockScreen({ onUpgrade, colors }: { onUpgrade: () => void; colors: Record<string, string> }) {
  return (
    <View style={[styles.lockScreen, { backgroundColor: colors.background }]}>
      <View style={[styles.lockCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={styles.lockIcon}>☕</Text>
        <Text style={[styles.lockTitle, { color: colors.text }]}>The Java Pit is Closed</Text>
        <Text style={[styles.lockSub, { color: colors.subText }]}>
          Join PRO to unlock live mentorship, the weekly forecast video, and our exclusive trading chat room.
        </Text>
        <Pressable
          onPress={onUpgrade}
          style={({ pressed }) => [styles.upgradeBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Text style={styles.upgradeBtnText}>Upgrade to PRO</Text>
        </Pressable>

        <View style={[styles.previewCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.previewLabel, { color: colors.subText }]}>Live Chat Preview</Text>
          <View style={styles.previewBlur}>
            <Text style={styles.blurredText}>██████████: SPY print just hit the tape!</Text>
            <Text style={styles.blurredText}>████████: Locked in 20% on those calls 🔥</Text>
            <Text style={styles.blurredText}>████████: What's the level on QQQ today?</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function JavaPitScreen() {
  const { colors } = useTheme();
  const { isProUser } = useSubscription();
  const { prints } = useAdmin();
  const router = useRouter();

  if (!isProUser) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>The Java Pit</Text>
          <Text style={[styles.subtitle, { color: colors.subText }]}>Live Trading Room & Weekly Whispers</Text>
        </View>
        <LockScreen onUpgrade={() => router.push('/paywall')} colors={colors} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>The Java Pit</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Live Trading Room & Weekly Whispers</Text>

        {/* Video Player */}
        <View style={styles.videoContainer}>
          <WebView
            scrollEnabled={false}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsFullscreenVideo={true}
            source={{ uri: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }}
          />
        </View>

        {/* Dark Pool Whispers Feed */}
        <View style={styles.whisperSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Dark Pool Whispers 🕵️‍♂️</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {canAccessAdmin && (
                <Pressable
                  onPress={() => router.push('/admin')}
                  style={({ pressed }) => [styles.adminQuickBtn, { opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text style={styles.adminQuickBtnText}>Manage</Text>
                </Pressable>
              )}
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.whisperScroll}>
            {prints.length === 0 ? (
              <Text style={{ color: colors.subText, fontStyle: 'italic' }}>No whispers detected yet...</Text>
            ) : (
              [...prints].reverse().map((print) => (
                <View key={print.id} style={[styles.whisperCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.whisperTop}>
                    <Text style={[styles.whisperTicker, { color: colors.text }]}>{print.ticker}</Text>
                    <Text style={styles.whisperType}>{print.type}</Text>
                  </View>
                  <Text style={[styles.whisperPrice, { color: '#34C759' }]}>${print.price}</Text>
                  <Text style={[styles.whisperMeta, { color: colors.subText }]}>{print.shares} Shares · {print.time}</Text>
                  <View style={styles.levelsRow}>
                    <Text style={[styles.levelLabel, { color: '#34C759' }]}>BULL {'>'} {print.bullish}</Text>
                    <Text style={[styles.levelLabel, { color: '#FF3B30' }]}>BEAR {'<'} {print.bearish}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        {/* Community Chat */}
        <View style={[styles.chatRoom, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.chatHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.chatTitle, { color: colors.text }]}>Live Community Chat</Text>
            <Text style={{ color: '#34C759', fontWeight: 'bold' }}>● Online</Text>
          </View>
          <View style={styles.chatScroll}>
            <View style={styles.message}>
              <Text style={[styles.author, { color: colors.text }]}>
                Stefanie Kammerman <Text style={styles.hostBadge}>Host</Text>
              </Text>
              <Text style={[styles.msgText, { color: colors.subText }]}>
                Good morning everyone! Watch SPY closely here guys, massive print just hit the tape at 512.
              </Text>
            </View>
            <View style={styles.message}>
              <Text style={[styles.author, { color: colors.text }]}>TraderJoe</Text>
              <Text style={[styles.msgText, { color: colors.subText }]}>Locked in 20% on those calls, thanks Stef!</Text>
            </View>
            <View style={styles.message}>
              <Text style={[styles.author, { color: colors.text }]}>AlphaSeeker</Text>
              <Text style={[styles.msgText, { color: colors.subText }]}>What is the bearish level on QQQ today?</Text>
            </View>
          </View>
          <View style={[styles.chatInput, { borderTopColor: colors.border }]}>
            <Text style={{ color: colors.subText }}>Type a message...</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { padding: 24, paddingTop: 40, paddingBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 4 },
  container: { padding: 16, paddingTop: 40, paddingBottom: 40 },
  lockScreen: { flex: 1, padding: 16 },
  lockCard: { borderRadius: 20, borderWidth: 1, padding: 24, alignItems: 'center' },
  lockIcon: { fontSize: 48, marginBottom: 16 },
  lockTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  lockSub: { fontSize: 15, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  upgradeBtn: {
    backgroundColor: '#34C759',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 100,
    marginBottom: 28,
  },
  upgradeBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  previewCard: { width: '100%', borderRadius: 12, borderWidth: 1, padding: 16 },
  previewLabel: { fontSize: 12, marginBottom: 12, fontWeight: 'bold' },
  previewBlur: { gap: 8 },
  blurredText: { color: '#555', fontSize: 13, letterSpacing: 0.5 },
  videoContainer: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#000',
  },
  webview: { flex: 1 },
  whisperSection: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  adminQuickBtn: { backgroundColor: 'rgba(52,199,89,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#34C759' },
  adminQuickBtnText: { color: '#34C759', fontSize: 13, fontWeight: 'bold' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(52,199,89,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34C759', marginRight: 6 },
  liveText: { color: '#34C759', fontSize: 10, fontWeight: 'bold' },
  whisperScroll: { gap: 12, paddingRight: 16 },
  whisperCard: { width: 180, padding: 16, borderRadius: 16, borderWidth: 1 },
  whisperTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  whisperTicker: { fontSize: 18, fontWeight: 'bold' },
  whisperType: { fontSize: 9, color: '#34C759', fontWeight: 'bold' },
  whisperPrice: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  whisperMeta: { fontSize: 11, marginBottom: 12 },
  levelsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10 },
  levelLabel: { fontSize: 10, fontWeight: 'bold' },
  chatRoom: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', minHeight: 300 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  chatTitle: { fontWeight: 'bold', fontSize: 16 },
  chatScroll: { padding: 16 },
  message: { marginBottom: 16 },
  author: { fontWeight: 'bold', marginBottom: 4 },
  hostBadge: { color: '#34C759', fontSize: 10 },
  msgText: { fontSize: 14, lineHeight: 20 },
  chatInput: { padding: 16, borderTopWidth: 1 },
});
