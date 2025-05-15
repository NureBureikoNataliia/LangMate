import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { View, StyleSheet, Platform, Dimensions, Text, TouchableOpacity } from 'react-native';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null while fonts are loading
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>LangMate</Text>
        </View>
      )}
      <View style={styles.content}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </View>
      {Platform.OS === 'web' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerText}>Help & FAQ</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f5f5f5', // Светло-серый фон для веб-сайта
    ...(Platform.OS === 'web' ? {
      minHeight: '100vh', // 100% высоты viewport на веб
      display: 'flex',
      flexDirection: 'column',
    } : {})
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  content: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    // Веб-специфичные стили
    ...(Platform.OS === 'web' ? {
      maxWidth: 900, // Уменьшенная ширина контейнера
      width: '90%', // Используем процентную ширину для адаптивности
      marginHorizontal: 'auto',
      padding: 20,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
      marginVertical: 20,
    } : {})
  },
  footer: {
    width: '100%',
    height: 60,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLink: {
    marginHorizontal: 15,
    padding: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  }
});