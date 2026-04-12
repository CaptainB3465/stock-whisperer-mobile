import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSubscription } from '@/context/SubscriptionContext';

export default function PaywallScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { upgradeToPro } = useSubscription();

  const handleSubscribe = async () => {
    await upgradeToPro();
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={{color: colors.text, fontSize: 18, fontWeight: 'bold'}}>X</Text>
          </Pressable>
        </View>

        <IconSymbol name="briefcase.fill" size={80} color="#34C759" />
        
        <Text style={[styles.title, { color: colors.text }]}>Unlock The Stock Whisperer PRO</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Get the ultimate edge in the market with Stefanie Kammerman.</Text>

        <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>🌊 Dark Pool Prints</Text>
          <Text style={[styles.featureDesc, { color: colors.subText }]}>Real-time alerts of large, hidden institutional block trades. Know the actionable levels.</Text>
        </View>

        <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>📈 Proprietary Indicators</Text>
          <Text style={[styles.featureDesc, { color: colors.subText }]}>Full access to Volume Buzz and the MoneyStream.</Text>
        </View>

        <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>☕ The Java Pit Entry</Text>
          <Text style={[styles.featureDesc, { color: colors.subText }]}>Join our exclusive live educational trading room and community.</Text>
        </View>
        
        <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>🎥 Weekly Whispers Video</Text>
          <Text style={[styles.featureDesc, { color: colors.subText }]}>High-success rate video recaps and weekly macro forecasts.</Text>
        </View>

        <View style={styles.pricingContainer}>
          <Text style={[styles.priceTag, { color: colors.text }]}>$49.99<Text style={styles.pricePeriod}> / month</Text></Text>
        </View>

        <Pressable 
          onPress={handleSubscribe} 
          style={({pressed}) => [styles.btn, { backgroundColor: '#34C759', opacity: pressed ? 0.8 : 1 }]}
        >
          <Text style={styles.btnText}>Subscribe to Premium</Text>
        </Pressable>
        <Text style={[styles.disclaimer, { color: colors.subText }]}>Cancel anytime. Billed monthly.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  closeBtn: {
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  featureCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
  },
  pricingContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  priceTag: {
    fontSize: 40,
    fontWeight: '900',
  },
  pricePeriod: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#A0A0A0',
  },
  btn: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
  },
});
