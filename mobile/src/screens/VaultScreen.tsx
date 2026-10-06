import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const CATEGORIES = [
  { key: 'all', label: 'All Assets', icon: 'apps-outline' },
  { key: 'documents', label: 'Documents', icon: 'document-text-outline' },
  { key: 'credentials', label: 'Credentials', icon: 'key-outline' },
  { key: 'links_accounts', label: 'Links & Social', icon: 'link-outline' },
  { key: 'business', label: 'Business', icon: 'briefcase-outline' },
  { key: 'intellectual_property', label: 'IP & Code', icon: 'code-slash-outline' },
  { key: 'cloud_storage', label: 'Cloud Drive', icon: 'cloud-outline' },
  { key: 'evidence', label: 'Evidence', icon: 'shield-outline' },
];

export default function VaultScreen({ onBack }: { onBack: () => void }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('documents');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVaultItems();
  }, [selectedCat]);

  const fetchVaultItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/vault?category=${selectedCat}`);
      setItems(res.data.items || []);
    } catch (err: any) {
      console.log('Error fetching vault items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async () => {
    if (!title || !content) {
      Alert.alert('Missing Info', 'Title and Content are required.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/vault', {
        title,
        category,
        content,
        notes,
      });

      Alert.alert('Encrypted & Saved', 'Your data was encrypted with AES-256-GCM before saving.');
      setModalVisible(false);
      setTitle('');
      setContent('');
      setNotes('');
      fetchVaultItems();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Encrypted Digital Vault</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <View style={styles.catContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.catPill, selectedCat === cat.key && styles.catPillActive]}
              onPress={() => setSelectedCat(cat.key)}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={selectedCat === cat.key ? '#0f172a' : '#94a3b8'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.catText, selectedCat === cat.key && styles.catTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Item List */}
      {loading ? (
        <ActivityIndicator color="#38bdf8" size="large" style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="lock-closed-outline" size={64} color="#334155" />
          <Text style={styles.emptyTitle}>Vault is Empty</Text>
          <Text style={styles.emptySub}>Tap the + button to encrypt & store documents, passwords or notes.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <View style={styles.encryptedTag}>
                  <Ionicons name="key" size={12} color="#38bdf8" />
                  <Text style={styles.encryptedText}>AES-256-GCM</Text>
                </View>
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <View style={styles.contentBox}>
                <Text style={styles.itemContent}>{item.content}</Text>
              </View>
              {item.notes ? <Text style={styles.itemNotes}>Note: {item.notes}</Text> : null}
            </View>
          )}
        />
      )}

      {/* Upload/Add Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Encrypt & Store Asset</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Title (e.g. Property Deed, Bank PIN)"
              placeholderTextColor="#64748b"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Select Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.smallCatPill, category === c.key && styles.catPillActive]}
                  onPress={() => setCategory(c.key)}
                >
                  <Text style={[styles.catText, category === c.key && styles.catTextActive]}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Secret Content / Credentials / Document Details"
              placeholderTextColor="#64748b"
              multiline
              value={content}
              onChangeText={setContent}
            />

            <TextInput
              style={styles.input}
              placeholder="Instructions / Notes for Nominee (Optional)"
              placeholderTextColor="#64748b"
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleCreateItem} disabled={saving}>
              {saving ? <ActivityIndicator color="#0f172a" /> : <Text style={styles.saveBtnText}>Encrypt & Save to Vault</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { padding: 8, backgroundColor: '#1e293b', borderRadius: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' },
  addBtn: { width: 40, height: 40, backgroundColor: '#38bdf8', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  catContainer: { marginBottom: 12 },
  catScroll: { paddingHorizontal: 20 },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  catPillActive: { backgroundColor: '#38bdf8', borderColor: '#38bdf8' },
  catText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  catTextActive: { color: '#0f172a', fontWeight: 'bold' },
  list: { padding: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#cbd5e1', marginTop: 16 },
  emptySub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  itemCard: { backgroundColor: '#1e293b', padding: 16, borderRadius: 14, marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { backgroundColor: '#0f172a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryText: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  encryptedTag: { flexDirection: 'row', alignItems: 'center' },
  encryptedText: { color: '#38bdf8', fontSize: 11, marginLeft: 4, fontWeight: '600' },
  itemTitle: { fontSize: 17, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
  contentBox: { backgroundColor: '#0f172a', padding: 12, borderRadius: 8, marginBottom: 8 },
  itemContent: { color: '#e2e8f0', fontSize: 14, fontFamily: 'monospace' },
  itemNotes: { color: '#94a3b8', fontSize: 12, italic: true },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#1e293b', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' },
  input: { backgroundColor: '#0f172a', borderRadius: 10, borderWidth: 1, borderColor: '#334155', color: '#f8fafc', padding: 12, fontSize: 15, marginBottom: 14 },
  label: { color: '#94a3b8', fontSize: 13, marginBottom: 8, fontWeight: '600' },
  smallCatPill: { backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: '#334155' },
  saveBtn: { backgroundColor: '#38bdf8', height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#0f172a', fontSize: 16, fontWeight: 'bold' },
});
