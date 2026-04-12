import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  SafeAreaView, ImageBackground, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && user) {
      router.replace('/(tabs)');
    }
  }, [user, isLoaded]);

  return (
    <ImageBackground
      source={require('@/assets/images/login_background.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      {/* Dark overlay for readability */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>

          {/* Top Branding */}
          <View style={styles.branding}>
            <View style={styles.logoRing}>
              <Text style={styles.logoEmoji}>📈</Text>
            </View>
            <Text style={styles.appTitle}>The Stock Whisperer</Text>
            <Text style={styles.tagline}>Institutional Intelligence. Simplified.</Text>

            {/* Live ticker strip */}
            <View style={styles.ticker}>
              <Text style={styles.tickerText}>AAPL +1.2%  •  NVDA +3.4%  •  SPY +0.8%  •  TSLA -0.5%</Text>
            </View>
          </View>

          {/* Auth Buttons */}
          <View style={styles.actionContainer}>
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>Member Access</Text>
              <Text style={styles.cardSub}>Sign in to unlock your Dark Pool feed, Java Pit, and weekly forecasts.</Text>

              <Pressable
                onPress={() => router.push('/(auth)/register')}
                style={({ pressed }) => [styles.btnPrimary, { opacity: pressed ? 0.85 : 1 }]}
              >
                <Text style={styles.btnPrimaryText}>Create Account</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push('/(auth)/login')}
                style={({ pressed }) => [styles.btnOutline, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={styles.btnOutlineText}>Member Sign In</Text>
              </Pressable>
            </View>

            <Pressable onPress={() => router.push('/privacy')} style={styles.privacyBtn}>
              <Text style={styles.privacyText}>🔒 Data Privacy & Encrypted Communications Guarantee</Text>
            </Pressable>
          </View>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  branding: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(52,199,89,0.15)',
    borderWidth: 2,
    borderColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  ticker: {
    marginTop: 24,
    backgroundColor: 'rgba(52,199,89,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  tickerText: {
    color: '#34C759',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionContainer: {
    marginBottom: 16,
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    backdropFilter: 'blur(20px)',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  btnPrimary: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  btnOutline: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  btnOutlineText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  privacyBtn: {
    alignItems: 'center',
  },
  privacyText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
