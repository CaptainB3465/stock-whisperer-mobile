import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={{color: colors.text, fontSize: 18, fontWeight: 'bold'}}>X</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <IconSymbol name="briefcase.fill" size={64} color={colors.text} style={{marginBottom: 24}} />
        
        <Text style={[styles.title, { color: colors.text }]}>Data Privacy & Protection</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Our Commitment to Your Security.</Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#34C759' }]}>1. Member Account Login & Security</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            We operate a secure, encrypted login gateway required for all Java Pit and Training Pit members. Your authentication credentials (whether via Email, Password, or Biometric tokens) are handled exclusively over HTTPS protocol and never exposed in plain text.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#34C759' }]}>2. Secure Access to Services</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            The Stock Whisperer app handles sensitive, proprietary market data, including real-time Dark Pool transitions. Because of the institutional value of this data, authenticated access is rigidly enforced to prevent unauthorized data scraping or leaks of our proprietary alerts.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#34C759' }]}>3. Encrypted Communication</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            All activity within the Java Pit chat rooms, alongside your local application preferences (like watchlists and themes), is transmitted through secure, encrypted communication arrays to guarantee your trading intent and personal identity are protected.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#34C759' }]}>4. Data Collection</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            As outlined in our official Privacy Policy framework, we collect minimal data required to maintain your active subscription, provide technical support, and verify your membership status for The Java Pit. 
          </Text>
        </View>
        
        <Pressable 
          onPress={() => router.back()} 
          style={({pressed}) => [styles.btn, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.btnText, { color: colors.text }]}>I Understand</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 24,
    alignItems: 'flex-end',
  },
  closeBtn: {
    padding: 8,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
  },
  btn: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 32,
    borderWidth: 1,
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
