import { Tabs, router } from "expo-router";
import { View, Platform, Text } from "react-native";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "../../components/theme";
import BrandedLoader from "../../components/BrandedLoader";
import { onAuthChange, reloadAuthUser } from "../../firebase/auth";
import { subscribeToNotifications } from "../../firebase/notifications";
import { AppSettings, DEFAULT_SETTINGS, subscribeToAppSettings } from "../../store/settings";

function TabIcon({
  name,
  focused,
  badge,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  focused: boolean;
  badge?: number;
}) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <View>
        <Ionicons name={name} size={20} color={focused ? C.accent : C.t3} />
        {!!badge && badge > 0 && (
          <View style={{
            position: "absolute",
            top: -6,
            right: -10,
            minWidth: 17,
            height: 17,
            borderRadius: 9,
            backgroundColor: C.red,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 4,
            borderWidth: 1.5,
            borderColor: C.bg1,
          }}>
            <Text style={{ color: "#fff", fontSize: 9, fontWeight: "800" }}>{badge > 9 ? "9+" : badge}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const unsub = onAuthChange(async user => {
      if (!user) {
        router.replace("/(auth)/login");
        return;
      }

      const refreshed = await reloadAuthUser(user);
      if (!refreshed) {
        router.replace("/(auth)/login");
        return;
      }

      if (!refreshed.emailVerified) {
        router.replace("/(auth)/verify-email");
        return;
      }

      setCheckingAuth(false);
    });

    return unsub;
  }, []);

  useEffect(() => subscribeToAppSettings(setSettings), []);

  useEffect(() => {
    if (checkingAuth) return;
    const unsub = subscribeToNotifications(notifs => {
      setUnreadCount(notifs.filter(n => !n.read).length);
    });
    return unsub;
  }, [checkingAuth]);

  const tabBarHeight = 58 + Math.max(insets.bottom, Platform.OS === "android" ? 8 : 0);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg0 }}>
        <BrandedLoader title="Preparing your workspace" subtitle="Checking your account and notifications." compact />
      </View>
    );
  }

  const notificationBadge = settings.pushEnabled ? unreadCount : 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.bg1,
          borderTopColor: C.borderLight,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: Math.max(insets.bottom, Platform.OS === "android" ? 8 : 0),
          paddingTop: 10,
          elevation: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.t3,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", marginTop: 2 },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: ({ focused }) => <TabIcon name={focused ? "home" : "home-outline"} focused={focused} /> }} />
      <Tabs.Screen name="ask" options={{ title: "Ask", tabBarIcon: ({ focused }) => <TabIcon name={focused ? "add-circle" : "add-circle-outline"} focused={focused} /> }} />
      <Tabs.Screen name="my-queries" options={{ title: "My Q's", tabBarIcon: ({ focused }) => <TabIcon name={focused ? "document-text" : "document-text-outline"} focused={focused} /> }} />
      <Tabs.Screen name="notifications" options={{ title: "Alerts", tabBarIcon: ({ focused }) => <TabIcon name={focused ? "notifications" : "notifications-outline"} focused={focused} badge={notificationBadge} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ focused }) => <TabIcon name={focused ? "person" : "person-outline"} focused={focused} /> }} />
    </Tabs>
  );
}
