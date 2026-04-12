import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/context/ThemeContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function JavaPitScreen() {
  const { colors, theme } = useTheme();
  const { isProUser } = useSubscription();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>The Java Pit</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Live Trading Room & Weekly Whispers</Text>

        <View style={styles.videoContainer}>
          {isProUser ? (
            <WebView
              style={styles.webview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
              source={{ uri: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }}
            />
          ) : (
            <View style={[styles.mockWebview, { backgroundColor: '#1E1E1E' }]}>
              <IconSymbol name="play.rectangle.fill" size={64} color="#555" />
            </View>
          )}
        </View>

        <View style={[styles.chatRoom, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatTitle, { color: colors.text }]}>Live Community Chat</Text>
            <Text style={{color: '#34C759', fontWeight: 'bold'}}>● Online</Text>
          </View>
          
          <ScrollView style={styles.chatScroll}>
            <View style={styles.message}>
              <Text style={[styles.author, { color: colors.text }]}>Stefanie Kammerman <Text style={styles.badge}>Host</Text></Text>
              <Text style={[styles.msgText, { color: colors.subText }]}>Good morning everyone! Watch SPY closely here guys, massive print just hit the tape at 512.</Text>
            </View>
            <View style={styles.message}>
              <Text style={[styles.author, { color: colors.text }]}>TraderJoe</Text>
              <Text style={[styles.msgText, { color: colors.subText }]}>Locked in 20% on those calls, thanks Stef!</Text>
            </View>
            <View style={styles.message}>
              <Text style={[styles.author, { color: colors.text }]}>AlphaSeeker</Text>
              <Text style={[styles.msgText, { color: colors.subText }]}>What is the bearish level on QQQ today?</Text>
            </View>
          </ScrollView>
          
          <View style={styles.chatInput}>
            <Text style={{ color: colors.subText }}>Type a message...</Text>
          </View>
        </View>
      </ScrollView>

      {!isProUser && (
        <View style={[StyleSheet.absoluteFill, styles.lockOverlay]}>
          <BlurView intensity={theme === 'dark' ? 80 : 50} tint={theme === 'dark' ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, styles.blurView]}>
            <IconSymbol name="play.rectangle.fill" size={48} color={colors.text} style={{marginBottom: 16}} />
            <Text style={[styles.lockTitle, { color: colors.text }]}>The Java Pit is Closed</Text>
            <Text style={[styles.lockSub, { color: colors.text }]}>Join the PRO community for live mentorship, chat room access, and Weekly Whispers.</Text>
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
  container: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 24,
  },
  videoContainer: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  mockWebview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatRoom: {
    flex: 1,
    minHeight: 400,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  chatTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatScroll: {
    padding: 16,
    flex: 1,
  },
  message: {
    marginBottom: 16,
  },
  author: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badge: {
    color: '#34C759',
    fontSize: 10,
    borderWidth: 1,
    borderColor: '#34C759',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatInput: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
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
    textAlign: 'center',
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
