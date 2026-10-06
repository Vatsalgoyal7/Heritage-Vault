import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function AIWillScreen({ onBack }: { onBack: () => void }) {
  const [residence, setResidence] = useState('New Delhi, India');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedWill, setGeneratedWill] = useState<string | null>(null);

  const handleGenerateWill = async () => {
    setLoading(true);
    try {
      const res = await api.post('/will/generate', {
        residence,
        specialInstructions,
      });

      setGeneratedWill(res.data.willText);
      Alert.alert('Digital Will Generated', 'Your formal legal digital will document is ready.');
    } catch (err: any) {
      Alert.alert('Generation Error', err.response?.data?.error || 'Failed to generate AI Digital Will');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Will Generator</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroCard}>
          <Ionicons name="document-text" size={32} color="#a78bfa" />
          <Text style={styles.heroTitle}>Gemini AI Legal Will Generator</Text>
          <Text style={styles.heroSub}>
            Automatically drafts a legal-sounding digital asset inheritance document mapping your vault items to designated nominees.
          </Text>
        </View>

        {!generatedWill ? (
          <View style={styles.formCard}>
            <Text style={styles.label}>City / State of Residence</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mumbai, Maharashtra"
              placeholderTextColor="#64748b"
              value={residence}
              onChangeText={setResidence}
            />

            <Text style={styles.label}>Custom Wishes / Instructions</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="e.g. Please transfer family photos to Mother and property papers to Father."
              placeholderTextColor="#64748b"
              multiline
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
            />

            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerateWill} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text style={styles.generateBtnText}>Generate Digital Will (AI)</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.documentCard}>
            <View style={styles.docHeader}>
              <Ionicons name="shield-checkmark" size={20} color="#10b981" />
              <Text style={styles.docStatus}>Legally Structured Digital Will</Text>
            </View>
            <ScrollView style={styles.docScroll} nestedScrollEnabled>
              <Text style={styles.docText}>{generatedWill}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.reGenerateBtn} onPress={() => setGeneratedWill(null)}>
              <Text style={styles.reGenerateText}>Edit & Regenerate</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { padding: 8, backgroundColor: '#1e293b', borderRadius: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' },
  scroll: { padding: 20 },
  heroCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  heroTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginTop: 10, marginBottom: 6 },
  heroSub: { fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 18 },
  formCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  label: { color: '#cbd5e1', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#0f172a', borderRadius: 10, borderWidth: 1, borderColor: '#334155', color: '#f8fafc', padding: 12, fontSize: 15, marginBottom: 16 },
  generateBtn: { backgroundColor: '#a78bfa', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  generateBtnText: { color: '#0f172a', fontSize: 16, fontWeight: 'bold' },
  documentCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  docHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  docStatus: { color: '#6ee7b7', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
  docScroll: { maxHeight: 400, backgroundColor: '#0f172a', padding: 16, borderRadius: 10, marginBottom: 16 },
  docText: { color: '#e2e8f0', fontSize: 13, fontFamily: 'monospace', lineHeight: 20 },
  reGenerateBtn: { backgroundColor: '#334155', height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  reGenerateText: { color: '#f8fafc', fontSize: 14, fontWeight: '600' },
});
