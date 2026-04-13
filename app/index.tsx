import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  SafeAreaView, ImageBackground, Animated, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [showAnimation, setShowAnimation] = useState(true);
  const [analysisStep, setAnalysisStep] = useState(0);
  
  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1.1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const steps = [
    "Initializing Neural Engine...",
    "Connecting to Dark Pool Feed...",
    "Scanning SPY Order Flow...",
    "Analyzing Institutional Prints...",
    "Cross-Referencing Tech Sector...",
    "Isolating Unusual Volume...",
    "Calculating Bullish/Bearish Divergence...",
    "Finalizing Market Whisper Signal...",
    "Ready to Trade."
  ];

  useEffect(() => {
    // Initial entrance animation
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 6, useNativeDriver: true }),
      ])
    ]).start();

    // Progress bar animation (30 Seconds)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 30000,
      useNativeDriver: false,
    }).start();

    // Rotate through analysis steps
    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => (prev + 1) % steps.length);
    }, 3500);

    // Transition to welcome screen after 30 seconds
    const timer = setTimeout(() => {
      clearInterval(stepInterval);
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
        Animated.timing(contentOpacity, { toValue: 1, duration: 1200, useNativeDriver: true })
      ]).start(() => {
        setShowAnimation(false);
      });
    }, 31000);

    return () => {
      clearTimeout(timer);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Animated.View style={[styles.bgContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <ImageBackground
          source={{ uri: 'file:///C:/Users/Administrator/.gemini/antigravity/brain/e6306fc4-5682-4017-98db-f96306073cec/stock_trends_background_1776029064624.png' }}
          style={styles.bg}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        {showAnimation ? (
          <Animated.View style={[styles.animContent, { opacity: logoOpacity, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.glassLabel}>
              <Text style={styles.label}>STOCK WHISPERER • QUANT ENGINE</Text>
            </View>
            
            <Text style={styles.animTitle}>Stock Tracker</Text>
            
            <View style={styles.dividerRoot}>
              <View style={styles.divider} />
              <View style={styles.dividerDot} />
              <View style={styles.divider} />
            </View>
            
            <Text style={styles.animSubtitle}>Your Online Market Analyzer</Text>
            
            {/* Extended Status UI */}
            <View style={styles.analysisContainer}>
              <Text style={styles.analysisText}>{steps[analysisStep]}</Text>
              <View style={styles.loaderContainer}>
                <Animated.View 
                  style={[
                    styles.loaderBar, 
                    { 
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 240]
                      }) 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.percentText}>
                {Math.floor(progressAnim.__getValue() * 100)}%
              </Text>
            </View>
            
            <View style={styles.tickerTape}>
               <Text style={styles.tickerTapeText}>
                 ANALYZING:AAPL..AMD..NVDA..TSLA..MSFT..SPY..QQQ..META..AMZN..GOOGL..NFLX..
               </Text>
            </View>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
            <View style={styles.branding}>
              <View style={styles.logoRing}>
                <Text style={styles.logoEmoji}>📈</Text>
              </View>
              <Text style={styles.appTitle}>The Stock Whisperer</Text>
              <Text style={styles.tagline}>Institutional Intelligence. Simplified.</Text>

              <View style={styles.ticker}>
                <Text style={styles.tickerText}>AAPL +1.2%  •  NVDA +3.4%  •  SPY +0.8%  •  TSLA -0.5%</Text>
              </View>
            </View>

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
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bgContainer: { ...StyleSheet.absoluteFillObject },
  bg: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  safeArea: { flex: 1 },
  animContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  glassLabel: {
    backgroundColor: 'rgba(52,199,89,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.2)',
    marginBottom: 20,
  },
  label: { color: '#34C759', fontSize: 10, fontWeight: 'bold', letterSpacing: 3 },
  animTitle: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', letterSpacing: 6, textAlign: 'center', textTransform: 'uppercase' },
  dividerRoot: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  divider: { width: 50, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  dividerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#34C759', marginHorizontal: 15 },
  animSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', letterSpacing: 4, textAlign: 'center', marginBottom: 60, textTransform: 'uppercase' },
  analysisContainer: { alignItems: 'center', width: '100%' },
  analysisText: { color: '#34C759', fontSize: 13, marginBottom: 15, fontWeight: '600', letterSpacing: 1 },
  loaderContainer: { width: 240, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  loaderBar: { height: '100%', backgroundColor: '#34C759' },
  percentText: { color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 10, fontWeight: 'bold' },
  tickerTape: { marginTop: 40, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20 },
  tickerTapeText: { color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: 2 },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  branding: { alignItems: 'center', marginTop: 60 },
  logoRing: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(52,199,89,0.15)', borderWidth: 2, borderColor: '#34C759', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoEmoji: { fontSize: 40 },
  appTitle: { fontSize: 30, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', letterSpacing: 0.5 },
  tagline: { fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: 8, textAlign: 'center', letterSpacing: 0.5 },
  ticker: { marginTop: 24, backgroundColor: 'rgba(52,199,89,0.12)', borderWidth: 1, borderColor: 'rgba(52,199,89,0.3)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100 },
  tickerText: { color: '#34C759', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  actionContainer: { marginBottom: 16 },
  glassCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 24, padding: 24, marginBottom: 16 },
  cardTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  cardSub: { color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 20, marginBottom: 24 },
  btnPrimary: { backgroundColor: '#34C759', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 12 },
  btnPrimaryText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  btnOutline: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
  btnOutlineText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
  privacyBtn: { alignItems: 'center' },
  privacyText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', textDecorationLine: 'underline' },
});
