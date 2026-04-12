import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  Pressable, TextInput, Modal, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAdmin, DarkPoolPrint } from '@/context/AdminContext';

const EMPTY_FORM = { ticker: '', type: 'Dark Pool', shares: '', price: '', bullish: '', bearish: '', time: '' };

export default function AdminScreen() {
  const { colors } = useTheme();
  const { prints, addPrint, updatePrint, deletePrint } = useAdmin();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<DarkPoolPrint | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEdit = (print: DarkPoolPrint) => {
    setEditTarget(print);
    setForm({
      ticker: print.ticker,
      type: print.type,
      shares: print.shares,
      price: String(print.price),
      bullish: String(print.bullish),
      bearish: String(print.bearish),
      time: print.time,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.ticker || !form.price) {
      Alert.alert('Error', 'Ticker and Price are required.');
      return;
    }
    const payload = {
      ticker: form.ticker.toUpperCase(),
      type: form.type,
      shares: form.shares,
      price: parseFloat(form.price),
      bullish: parseFloat(form.bullish) || 0,
      bearish: parseFloat(form.bearish) || 0,
      time: form.time || new Date().toLocaleTimeString(),
    };
    if (editTarget) {
      await updatePrint(editTarget.id, payload);
    } else {
      await addPrint(payload);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string, ticker: string) => {
    Alert.alert('Delete Print', `Remove ${ticker} print?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePrint(id) },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backText, { color: colors.subText }]}>← Back</Text>
        </Pressable>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Admin Panel</Text>
        <Pressable onPress={openCreate} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.sectionLabel, { color: colors.subText }]}>DARK POOL PRINTS ({prints.length})</Text>

        {prints.map((print) => (
          <View key={print.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardTop}>
              <View>
                <Text style={[styles.cardTicker, { color: colors.text }]}>{print.ticker}</Text>
                <Text style={[styles.cardType, { color: '#34C759' }]}>{print.type}</Text>
              </View>
              <View style={styles.cardActions}>
                <Pressable onPress={() => openEdit(print)} style={[styles.editBtn, { borderColor: colors.border }]}>
                  <Text style={[styles.editBtnText, { color: colors.text }]}>Edit</Text>
                </Pressable>
                <Pressable onPress={() => handleDelete(print.id, print.ticker)} style={styles.deleteBtn}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </Pressable>
              </View>
            </View>
            <Text style={[styles.cardMeta, { color: colors.subText }]}>
              {print.shares} @ ${print.price}  ·  Bull {'>'} {print.bullish}  ·  Bear {'<'} {print.bearish}  ·  {print.time}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Create / Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalSafe, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{ color: colors.subText, fontSize: 16 }}>Cancel</Text>
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editTarget ? 'Edit Print' : 'New Print'}
            </Text>
            <Pressable onPress={handleSave}>
              <Text style={{ color: '#34C759', fontSize: 16, fontWeight: 'bold' }}>Save</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            {[
              { label: 'Ticker', key: 'ticker', placeholder: 'AAPL' },
              { label: 'Type', key: 'type', placeholder: 'Dark Pool / Block Trade / Late Print' },
              { label: 'Shares', key: 'shares', placeholder: '1.2M' },
              { label: 'Price', key: 'price', placeholder: '175.00', numeric: true },
              { label: 'Bullish Level', key: 'bullish', placeholder: '176', numeric: true },
              { label: 'Bearish Level', key: 'bearish', placeholder: '174', numeric: true },
              { label: 'Time', key: 'time', placeholder: '10:30 AM' },
            ].map((field) => (
              <View key={field.key} style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>{field.label}</Text>
                <TextInput
                  style={[styles.fieldInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.subText}
                  keyboardType={field.numeric ? 'numeric' : 'default'}
                  autoCapitalize="characters"
                  value={(form as any)[field.key]}
                  onChangeText={(val) => setForm(prev => ({ ...prev, [field.key]: val }))}
                />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, paddingTop: 24,
  },
  backText: { fontSize: 16 },
  pageTitle: { fontSize: 20, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#34C759', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: 'white', fontWeight: 'bold' },
  container: { padding: 16 },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 12 },
  card: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTicker: { fontSize: 20, fontWeight: 'bold' },
  cardType: { fontSize: 13, fontWeight: 'bold' },
  cardMeta: { fontSize: 13 },
  cardActions: { flexDirection: 'row', gap: 8 },
  editBtn: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editBtnText: { fontSize: 13, fontWeight: '600' },
  deleteBtn: { backgroundColor: '#FF3B30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  deleteBtnText: { color: 'white', fontSize: 13, fontWeight: '600' },
  modalSafe: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalBody: { padding: 16 },
  fieldGroup: { marginBottom: 20 },
  fieldLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  fieldInput: { padding: 14, borderRadius: 10, borderWidth: 1, fontSize: 16 },
});
