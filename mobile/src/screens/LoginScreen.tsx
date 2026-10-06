import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api, { setAuthToken } from '../services/api';

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: (token: string, user: any) => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (isRegister && !name)) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const res = await api.post('/auth/register', { name, email, password });
        Alert.alert('Verification OTP Sent', 'Check your email for the 6-digit verification code.');
        setStep('otp');
      } else {
        const res = await api.post('/auth/login', { email, password, deviceFingerprint: 'android_device_001' });
        setAuthToken(res.data.token);
        onLoginSuccess(res.data.token, res.data.user);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to authenticate. Please check server.';
      Alert.alert('Auth Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert('Enter OTP', 'Please enter the 6-digit OTP sent to your email.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      setAuthToken(res.data.token);
      onLoginSuccess(res.data.token, res.data.user);
    } catch (err: any) {
      Alert.alert('Verification Failed', err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerContainer}>
          <View style={styles.logoBadge}>
            <Ionicons name="shield-checkmark" size={48} color="#38bdf8" />
          </View>
          <Text style={styles.brandTitle}>Heritage Vault</Text>
          <Text style={styles.brandSubtitle}>Secure Digital Legacy & Inheritance Platform</Text>
        </View>

        {step === 'form' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isRegister ? 'Create Secure Account' : 'Welcome Back'}</Text>

            {isRegister && (
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#64748b"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Master Password"
                placeholderTextColor="#64748b"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text style={styles.primaryBtnText}>{isRegister ? 'Register Account' : 'Access Vault'}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleBtn} onPress={() => setIsRegister(!isRegister)}>
              <Text style={styles.toggleText}>
                {isRegister ? 'Already have an account? Sign In' : "Don't have a vault? Register now"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enter Email OTP</Text>
            <Text style={styles.cardDesc}>We sent a verification code to {email}</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="6-Digit OTP"
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyOTP} disabled={loading}>
              {loading ? <ActivityIndicator color="#0f172a" /> : <Text style={styles.primaryBtnText}>Verify & Continue</Text>}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  headerContainer: { alignItems: 'center', marginBottom: 32 },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1e293b',
    justify: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#38bdf8',
  },
  brandTitle: { fontSize: 28, fontWeight: 'bold', color: '#f8fafc', letterSpacing: 0.5 },
  brandSubtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: '#1e293b', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#94a3b8', marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 48, color: '#f8fafc', fontSize: 16 },
  primaryBtn: {
    backgroundColor: '#38bdf8',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#0f172a', fontSize: 16, fontWeight: 'bold' },
  toggleBtn: { marginTop: 16, alignItems: 'center' },
  toggleText: { color: '#38bdf8', fontSize: 14 },
});
