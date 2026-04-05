import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "../../components/theme";

function TabIcon({ emoji, focused, badge }: { emoji: string; focused: boolean; badge?: number }) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <View>
        <Text style={{ fontSize: 19, lineHeight: 23, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>
        {!!badge && badge > 0 && (
          <View style={{
            position: "absolute", top: -4, right: -6,
            minWidth: 16, height: 16, borderRadius: 8,
            backgroundColor: C.red, alignItems: "center", justifyContent: "center",
            paddingHorizontal: 3, borderWidth: 1.5, borderColor: C.bg2,
          }}>
            <Text style={{ color: "#fff", fontSize: 9, fontWeight: "800" }}>
              {badge > 9 ? "9+" : badge}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.bg2,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 8,
          elevation: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.t3,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", marginTop: 1 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="ask"
        options={{
          title: "Ask",
          tabBarIcon: ({ focused }) => <TabIcon emoji="✏️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="my-queries"
        options={{
          title: "My Q's",
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔔" focused={focused} badge={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
