import { ThemeProvider } from '@/context/ThemeContext';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { AuthProvider } from '@/context/AuthContext';
import { AdminProvider } from '@/context/AdminContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <SubscriptionProvider>
            <WatchlistProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Chart Analysis' }} />
                <Stack.Screen name="paywall" options={{ presentation: 'fullScreenModal', headerShown: false }} />
                <Stack.Screen name="privacy" options={{ presentation: 'modal', title: 'Data Privacy' }} />
                <Stack.Screen name="admin" options={{ presentation: 'modal', title: 'Admin Panel', headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </WatchlistProvider>
          </SubscriptionProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
