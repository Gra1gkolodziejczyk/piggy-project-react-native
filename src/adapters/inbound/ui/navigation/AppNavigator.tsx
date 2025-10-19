import React, { useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '../hooks';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';

export function AppNavigator() {
  const { isLoading, isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'Login' | 'Register'>('Login');

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16 }}>Chargement...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return <HomeScreen />;
  }

  if (currentScreen === 'Register') {
    return <RegisterScreen onNavigateToLogin={() => setCurrentScreen('Login')} />;
  }

  return <LoginScreen onNavigateToRegister={() => setCurrentScreen('Register')} />;
}
