import { Tabs } from "expo-router";
import { Platform, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1E293B",
          borderTopColor: "#334155",
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#64748B",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color, lineHeight: 26 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="ask"
        options={{
          title: "Ask",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color, lineHeight: 26 }}>✏️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="my-queries"
        options={{
          title: "My Queries",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color, lineHeight: 26 }}>📋</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color, lineHeight: 26 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
