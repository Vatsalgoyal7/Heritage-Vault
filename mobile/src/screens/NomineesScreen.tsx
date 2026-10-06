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

export default function NomineesScreen({ onBack }: { onBack: () => void }) {
  const [nominees, setNominees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('Father');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNominees();
  }, []);

  const fetchNominees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/nominees');
      setNominees(res.data.nominees || []);
    } catch (err: any) {
      console.log('Error fetching nominees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNominee = async () => {
    if (!name || !email) {
      Alert.alert('Missing Info', 'Name and Email are required.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/nominees', {
        name,
        email,
        relation,
        assignedCategories: ['documents', 'credentials'],
      });

      Alert.alert('Nominee Added', 'Verification email sent to nominee.');
      setModalVisible(false);
      setName('');
      setEmail('');
      fetchNominees();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to add nominee');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nominees & Digital Executor</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Info card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#38bdf8" />
          <Text style={styles.infoText}>
            Nominees will only get access after 90 days of inactivity OR when an emergency request is manually approved by you.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#38bdf8" size="large" style={{ marginTop: 40 }} />
        ) : nominees.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#334155" />
            <Text style={styles.emptyTitle}>No Nominees Added</Text>
            <Text style={styles.emptySub}>Add trusted family members (Father, Mother, Spouse) to receive assigned assets.</Text>
          </View>
        ) : (
          nominees.map((item) => (
            <View key={item._id} style={styles.nomineeCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.nomineeName}>{item.name}</Text>
                <Text style={styles.nomineeSub}>{item.relation} • {item.email}</Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, item.isVerified ? styles.badgeVerified : styles.badgePending]}>
                    <Text style={styles.badgeLabel}>{item.isVerified ? 'Verified' : 'Pending OTP'}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Nominee Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Designate Trusted Nominee</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Relation (e.g. Father, Mother, Spouse, Sister)"
              placeholderTextColor="#64748b"
              value={relation}
              onChangeText={setRelation}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleAddNominee} disabled={saving}>
              {saving ? <ActivityIndicator color="#0f172a" /> : <Text style={styles.saveBtnText}>Send Verification Email</Text>}
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
  scroll: { padding: 20 },
  infoCard: { flexDirection: 'row', backgroundColor: '#1e293b', padding: 14, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  infoText: { color: '#94a3b8', fontSize: 13, marginLeft: 10, flex: 1, lineHeight: 18 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#cbd5e1', marginTop: 16 },
  emptySub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
  nomineeCard: { flexDirection: 'row', backgroundColor: '#1e293b', padding: 16, borderRadius: 14, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#38bdf820', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#38bdf8', fontSize: 20, fontWeight: 'bold' },
  nomineeName: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  nomineeSub: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  badgeRow: { flexDirection: 'row', marginTop: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeVerified: { backgroundColor: '#065f46' },
  badgePending: { backgroundColor: '#854d0e' },
  badgeLabel: { color: '#f8fafc', fontSize: 11, fontWeight: '600' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#1e293b', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' },
  input: { backgroundColor: '#0f172a', borderRadius: 10, borderWidth: 1, borderColor: '#334155', color: '#f8fafc', padding: 12, fontSize: 15, marginBottom: 14 },
  saveBtn: { backgroundColor: '#38bdf8', height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#0f172a', fontSize: 16, fontWeight: 'bold' },
});
