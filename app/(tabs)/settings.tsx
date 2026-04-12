import React from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        
        <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
          <Switch 
            value={theme === 'dark'} 
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>

      </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
