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

export default function MemoryCapsuleScreen({ onBack }: { onBack: () => void }) {
  const [capsuleType, setCapsuleType] = useState<'letter' | 'audio' | 'video'>('letter');
  const [title, setTitle] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [recipient, setRecipient] = useState('');
  const [deliverOn, setDeliverOn] = useState('on_dead_man_switch');
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(false);

  const handleCreateCapsule = () => {
    if (!title || (!letterContent && capsuleType === 'letter')) {
      Alert.alert('Missing Info', 'Title and Letter content are required.');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCreated(true);
      Alert.alert('Memory Capsule Sealed', 'Your emotional capsule has been encrypted and scheduled for delivery.');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Memory Capsule</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroCard}>
          <Ionicons name="heart" size={36} color="#f43f5e" />
          <Text style={styles.heroTitle}>Preserve Emotional Memories</Text>
          <Text style={styles.heroSub}>
            Record personal future letters, voice messages, or video capsules delivered to loved ones when the time comes.
          </Text>
        </View>

        {/* Type selector */}
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeBtn, capsuleType === 'letter' && styles.typeBtnActive]}
            onPress={() => setCapsuleType('letter')}
          >
            <Ionicons name="mail" size={20} color={capsuleType === 'letter' ? '#0f172a' : '#94a3b8'} />
            <Text style={[styles.typeText, capsuleType === 'letter' && styles.typeTextActive]}>Letter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, capsuleType === 'audio' && styles.typeBtnActive]}
            onPress={() => setCapsuleType('audio')}
          >
            <Ionicons name="mic" size={20} color={capsuleType === 'audio' ? '#0f172a' : '#94a3b8'} />
            <Text style={[styles.typeText, capsuleType === 'audio' && styles.typeTextActive]}>Audio Note</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, capsuleType === 'video' && styles.typeBtnActive]}
            onPress={() => setCapsuleType('video')}
          >
            <Ionicons name="videocam" size={20} color={capsuleType === 'video' ? '#0f172a' : '#94a3b8'} />
            <Text style={[styles.typeText, capsuleType === 'video' && styles.typeTextActive]}>Video</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Capsule Title (e.g. For my daughter on her 18th birthday)"
            placeholderTextColor="#64748b"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Recipient Name & Email (e.g. Sunita Kumar)"
            placeholderTextColor="#64748b"
            value={recipient}
            onChangeText={setRecipient}
          />

          {capsuleType === 'letter' ? (
            <TextInput
              style={[styles.input, { height: 140 }]}
              placeholder="Write your heartfelt message here..."
              placeholderTextColor="#64748b"
              multiline
              value={letterContent}
              onChangeText={setLetterContent}
            />
          ) : (
            <View style={styles.mediaBox}>
              <Ionicons name={capsuleType === 'audio' ? 'mic-circle' : 'videocam-circle'} size={56} color="#f43f5e" />
              <Text style={styles.mediaTitle}>Tap to Record {capsuleType === 'audio' ? 'Audio Message' : 'Video Capsule'}</Text>
              <Text style={styles.mediaSub}>Uses mobile camera & microphone</Text>
            </View>
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleCreateCapsule} disabled={saving}>
            {saving ? <ActivityIndicator color="#0f172a" /> : <Text style={styles.saveBtnText}>Seal Encrypted Capsule</Text>}
          </TouchableOpacity>
        </View>
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
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', paddingVertical: 12, borderRadius: 10, marginHorizontal: 4, borderWidth: 1, borderColor: '#334155' },
  typeBtnActive: { backgroundColor: '#f43f5e', borderColor: '#f43f5e' },
  typeText: { color: '#94a3b8', fontSize: 13, fontWeight: '600', marginLeft: 6 },
  typeTextActive: { color: '#0f172a', fontWeight: 'bold' },
  formCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  input: { backgroundColor: '#0f172a', borderRadius: 10, borderWidth: 1, borderColor: '#334155', color: '#f8fafc', padding: 12, fontSize: 15, marginBottom: 16 },
  mediaBox: { backgroundColor: '#0f172a', borderStyle: 'dashed', borderWidth: 2, borderColor: '#f43f5e60', borderRadius: 14, padding: 24, alignItems: 'center', marginBottom: 16 },
  mediaTitle: { color: '#f8fafc', fontWeight: 'bold', fontSize: 15, marginTop: 8 },
  mediaSub: { color: '#64748b', fontSize: 12, marginTop: 4 },
  saveBtn: { backgroundColor: '#f43f5e', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#0f172a', fontSize: 16, fontWeight: 'bold' },
});
