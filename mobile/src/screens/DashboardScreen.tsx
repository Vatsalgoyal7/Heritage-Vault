import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  user: any;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export default function DashboardScreen({ user, onNavigate, onLogout }: Props) {
  const trustScore = user?.trustScore || 85;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Protected Legacy</Text>
            <Text style={styles.userName}>{user?.name || 'Vault Owner'}</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.iconBtn}>
            <Ionicons name="log-out-outline" size={24} color="#f43f5e" />
          </TouchableOpacity>
        </View>

        {/* Trust Score Banner */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Ionicons name="shield-checkmark" size={28} color="#38bdf8" />
            <Text style={styles.scoreTitle}>Legacy Preparedness Score</Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreNumber}>{trustScore}%</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${trustScore}%` }]} />
            </View>
          </View>
          <Text style={styles.scoreSubtitle}>
            {trustScore > 80 ? 'Vault is well-secured with active nominees.' : 'Add nominees & digital will to reach 100%'}
          </Text>
        </View>

        {/* Dead Man's Switch Status */}
        <View style={styles.switchCard}>
          <View style={styles.switchHeader}>
            <Ionicons name="timer-outline" size={24} color="#10b981" />
            <Text style={styles.switchTitle}>Dead Man's Switch Status</Text>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.activeBadge}>
              <Text style={styles.badgeText}>Active & Monitoring</Text>
            </View>
            <Text style={styles.switchTimerText}>Timer: 90 Days</Text>
          </View>
          <Text style={styles.switchDesc}>
            System monitors activity daily. 3-stage notifications trigger on Day 15, 30, and 60.
          </Text>
        </View>

        {/* Grid Features */}
        <Text style={styles.sectionTitle}>Vault Features</Text>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridCard} onPress={() => onNavigate('vault')}>
            <View style={[styles.gridIconBg, { backgroundColor: '#0284c720' }]}>
              <Ionicons name="lock-closed" size={26} color="#38bdf8" />
            </View>
            <Text style={styles.gridTitle}>Encrypted Vault</Text>
            <Text style={styles.gridSub}>8 Asset Categories</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={() => onNavigate('nominees')}>
            <View style={[styles.gridIconBg, { backgroundColor: '#10b98120' }]}>
              <Ionicons name="people" size={26} color="#10b981" />
            </View>
            <Text style={styles.gridTitle}>Nominees & Executor</Text>
            <Text style={styles.gridSub}>Assign Controlled Files</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={() => onNavigate('will')}>
            <View style={[styles.gridIconBg, { backgroundColor: '#8b5cf620' }]}>
              <Ionicons name="document-text" size={26} color="#a78bfa" />
            </View>
            <Text style={styles.gridTitle}>AI Will Generator</Text>
            <Text style={styles.gridSub}>Gemini AI Powered</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={() => onNavigate('memory')}>
            <View style={[styles.gridIconBg, { backgroundColor: '#f43f5e20' }]}>
              <Ionicons name="heart" size={26} color="#f43f5e" />
            </View>
            <Text style={styles.gridTitle}>Memory Capsules</Text>
            <Text style={styles.gridSub}>Future Letters & Audio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 13, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc' },
  iconBtn: { padding: 8, backgroundColor: '#1e293b', borderRadius: 10 },
  scoreCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  scoreHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  scoreTitle: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc', marginLeft: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  scoreNumber: { fontSize: 32, fontWeight: 'bold', color: '#38bdf8', marginRight: 16 },
  progressBarBg: { flex: 1, height: 10, backgroundColor: '#0f172a', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#38bdf8', borderRadius: 5 },
  scoreSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  switchCard: { backgroundColor: '#1e293b', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  switchHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  switchTitle: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc', marginLeft: 8 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  activeBadge: { backgroundColor: '#065f46', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#6ee7b7', fontSize: 12, fontWeight: 'bold' },
  switchTimerText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  switchDesc: { fontSize: 12, color: '#94a3b8', lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { backgroundColor: '#1e293b', width: '48%', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  gridIconBg: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  gridTitle: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc', marginBottom: 4 },
  gridSub: { fontSize: 12, color: '#94a3b8' },
});
