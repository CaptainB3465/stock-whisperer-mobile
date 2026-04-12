import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useTheme } from '@/context/ThemeContext';
import { useSubscription } from '@/context/SubscriptionContext';
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

        {/* Blurred chat preview */}
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

        <View style={styles.videoContainer}>
          <WebView
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsFullscreenVideo={true}
            source={{ uri: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }}
          />
        </View>

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
