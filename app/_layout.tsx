import "./global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { C } from "../components/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={C.bg0} />
      <Stack screenOptions={{ headerShown: false, animation: "ios_from_right" }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="query/[id]" />
      </Stack>
    </SafeAreaProvider>
  );
}
