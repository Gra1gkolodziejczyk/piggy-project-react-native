import { AuthProvider, useAuth } from "@/src/infrastructure/providers";
import { Stack, useRouter, useSegments } from "expo-router";

import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)");
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, segments, isLoading, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
