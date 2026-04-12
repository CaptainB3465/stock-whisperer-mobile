import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const authenticate = async () => {
    setIsAuthenticating(true);
    setErrorMsg('');
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // Bypass for devices without biometrics configured
        router.replace('/(tabs)');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Stock Whisperer',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setErrorMsg('Authentication failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <IconSymbol name="house.fill" size={64} color={colors.text} />
        <Text style={[styles.title, { color: colors.text }]}>Stock Whisperer</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Locked for your security.</Text>
        
        {errorMsg ? <Text style={[styles.error, { color: colors.badgeNegative }]}>{errorMsg}</Text> : null}

        <Pressable 
          onPress={authenticate} 
          disabled={isAuthenticating}
          style={({pressed}) => [styles.btn, { backgroundColor: colors.card, opacity: pressed || isAuthenticating ? 0.7 : 1 }]}
        >
          <Text style={[styles.btnText, { color: colors.text }]}>
            {isAuthenticating ? 'Scanning...' : 'Unlock'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 40,
  },
  btn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
  },
  error: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
});
