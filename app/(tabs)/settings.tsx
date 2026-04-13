import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  Switch, Pressable, Alert, Modal, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useAdmin } from '@/context/AdminContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface SettingRowProps {
  icon: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  colors: Record<string, string>;
  danger?: boolean;
}

function SettingRow({ icon, label, sublabel, onPress, rightElement, colors, danger }: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, { backgroundColor: colors.card, opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.rowLeft}>
        <IconSymbol name={icon as any} size={22} color={danger ? '#FF3B30' : colors.text} />
        <View style={{ marginLeft: 14 }}>
          <Text style={[styles.rowLabel, { color: danger ? '#FF3B30' : colors.text }]}>{label}</Text>
          {sublabel ? <Text style={[styles.rowSublabel, { color: colors.subText }]}>{sublabel}</Text> : null}
        </View>
      </View>
      {rightElement ?? (
        onPress ? <IconSymbol name="chevron.right" size={18} color={colors.subText} /> : null
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { isProUser, resetToFree } = useSubscription();
  const { isAdmin, setAdminMode, canAccessAdmin } = useAdmin();
  const router = useRouter();

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          // Navigate to transition first to avoid root layout redirection conflicts
          router.replace('/transition');
          // Add a small delay then sign out
          setTimeout(async () => {
            await signOut();
          }, 300);
        },
      },
    ]);
  };

  const handleSupportCall = () => {
    Alert.alert('Support', 'Contact us at support@stockwhisperer.com\nor call +1 (888) 555-0199', [
      { text: 'OK' },
    ]);
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) return;
    setFeedbackVisible(false);
    setFeedbackText('');
    Alert.alert('Thank you!', 'Your feedback has been submitted.');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: '#34C759' }]}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </Text>
          </View>
          <View style={{ marginLeft: 16 }}>
            <Text style={[styles.profileName, { color: colors.text }]}>{user?.name ?? 'Member'}</Text>
            <Text style={[styles.profileEmail, { color: colors.subText }]}>{user?.email ?? ''}</Text>
            <View style={[styles.badge, { backgroundColor: isProUser ? 'rgba(52,199,89,0.15)' : 'rgba(160,160,160,0.15)' }]}>
              <Text style={[styles.badgeText, { color: isProUser ? '#34C759' : colors.subText }]}>
                {isProUser ? '⭐ PRO Member' : 'Free Plan'}
              </Text>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <Text style={[styles.section, { color: colors.subText }]}>APPEARANCE</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <SettingRow
            icon="gearshape.fill"
            label="Dark Mode"
            sublabel={theme === 'dark' ? 'Currently on' : 'Currently off'}
            colors={colors}
            rightElement={
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor="white"
              />
            }
          />
        </View>

        {/* Subscription */}
        <Text style={[styles.section, { color: colors.subText }]}>SUBSCRIPTION & BILLING</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          {!isProUser ? (
            <SettingRow
              icon="briefcase.fill"
              label="Upgrade to PRO"
              sublabel="Unlock Dark Pool Alerts & Java Pit"
              onPress={() => router.push('/paywall')}
              colors={colors}
            />
          ) : (
            <SettingRow
              icon="briefcase.fill"
              label="Active PRO Subscription"
              sublabel="$49.99 / month — Renews automatically"
              colors={colors}
            />
          )}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow
            icon="gearshape.fill"
            label="Billing & Payment"
            sublabel="Manage your payment methods"
            onPress={() => Alert.alert('Billing', 'Manage your billing at:\nstockwhisperer.com/billing')}
            colors={colors}
          />
          {isProUser && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <SettingRow
                icon="gearshape.fill"
                label="Cancel Subscription"
                sublabel="Revert to free plan"
                onPress={() => Alert.alert('Cancel Subscription', 'Are you sure?', [
                  { text: 'Keep PRO', style: 'cancel' },
                  { text: 'Cancel Plan', style: 'destructive', onPress: () => resetToFree() },
                ])}
                colors={colors}
              />
            </>
          )}
        </View>

        {/* Support */}
        <Text style={[styles.section, { color: colors.subText }]}>SUPPORT</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <SettingRow
            icon="bell.fill"
            label="Contact Support"
            sublabel="Get help from our team"
            onPress={handleSupportCall}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow
            icon="bell.fill"
            label="Send Feedback"
            sublabel="Help us improve the app"
            onPress={() => setFeedbackVisible(true)}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow
            icon="gearshape.fill"
            label="Privacy Policy"
            onPress={() => router.push('/privacy')}
            colors={colors}
          />
        </View>

        {/* Account */}
        <Text style={[styles.section, { color: colors.subText }]}>ACCOUNT</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          {canAccessAdmin && (
            <>
              <SettingRow
                icon="gearshape.fill"
                label="Admin Panel"
                sublabel="Manage Dark Pool Prints"
                onPress={() => {
                  setAdminMode(true);
                  router.push('/admin');
                }}
                colors={colors}
              />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </>
          )}
          <SettingRow
            icon="gearshape.fill"
            label="Sign Out"
            onPress={handleSignOut}
            colors={colors}
            danger
          />
        </View>

        <Text style={[styles.version, { color: colors.subText }]}>Stock Whisperer v1.0.0</Text>
      </ScrollView>

      {/* Feedback Modal */}
      <Modal visible={feedbackVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Send Feedback</Text>
            <Pressable onPress={() => setFeedbackVisible(false)}>
              <Text style={{ color: colors.subText, fontSize: 16 }}>Cancel</Text>
            </Pressable>
          </View>
          <TextInput
            style={[styles.feedbackInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="Tell us what you think..."
            placeholderTextColor={colors.subText}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            value={feedbackText}
            onChangeText={setFeedbackText}
          />
          <Pressable
            onPress={handleFeedbackSubmit}
            style={({ pressed }) => [styles.submitBtn, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Text style={styles.submitBtnText}>Submit Feedback</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 16, paddingTop: 40, paddingBottom: 60 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  profileName: { fontSize: 20, fontWeight: 'bold' },
  profileEmail: { fontSize: 14, marginTop: 2 },
  badge: { marginTop: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  section: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  group: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: '500' },
  rowSublabel: { fontSize: 13, marginTop: 2 },
  divider: { height: 1, marginLeft: 52 },
  version: { textAlign: 'center', fontSize: 12, marginTop: 8 },
  modalContainer: { flex: 1, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  feedbackInput: { padding: 16, borderRadius: 12, borderWidth: 1, fontSize: 16, minHeight: 160, marginBottom: 24 },
  submitBtn: { backgroundColor: '#34C759', paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
