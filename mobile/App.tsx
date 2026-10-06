import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import VaultScreen from './src/screens/VaultScreen';
import NomineesScreen from './src/screens/NomineesScreen';
import AIWillScreen from './src/screens/AIWillScreen';
import MemoryCapsuleScreen from './src/screens/MemoryCapsuleScreen';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');

  const handleLoginSuccess = (userToken: string, userData: any) => {
    setToken(userToken);
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setCurrentScreen('login');
  };

  if (!token) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {currentScreen === 'dashboard' && (
        <DashboardScreen
          user={user}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'vault' && (
        <VaultScreen onBack={() => setCurrentScreen('dashboard')} />
      )}

      {currentScreen === 'nominees' && (
        <NomineesScreen onBack={() => setCurrentScreen('dashboard')} />
      )}

      {currentScreen === 'will' && (
        <AIWillScreen onBack={() => setCurrentScreen('dashboard')} />
      )}

      {currentScreen === 'memory' && (
        <MemoryCapsuleScreen onBack={() => setCurrentScreen('dashboard')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
