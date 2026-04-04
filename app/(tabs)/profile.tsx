import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  name: string;
  email: string;
  college: string;
  department: string;
};

const MENU_ITEMS = [
  { icon: "📋", label: "My Queries", sub: "Queries posted by you", route: "/(tabs)/my-queries" },
  { icon: "💬", label: "My Answers", sub: "Answers given by you", route: null },
  { icon: "🔖", label: "Saved Queries", sub: "Queries you saved", route: null },
  { icon: "🏷️", label: "Topics I Follow", sub: "DSA, Networks, Math", route: null },
  { icon: "🔔", label: "Notifications", sub: "3 unread", route: null },
  { icon: "⚙️", label: "Settings", sub: "Privacy, password", route: null },
];

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const data = await AsyncStorage.getItem("user");
    if (data) setUser(JSON.parse(data));
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["userToken", "user"]);
    router.replace("/(auth)/login" as any);
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0F172A" }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>Profile</Text>
        <TouchableOpacity style={{ backgroundColor: "#1E293B", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#334155" }}>
          <Text style={{ color: "#94A3B8", fontSize: 12, fontWeight: "600" }}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar + Info */}
      <View style={{ alignItems: "center", paddingBottom: 24, paddingTop: 8 }}>
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: "#6366F1", alignItems: "center", justifyContent: "center", marginBottom: 14, borderWidth: 3, borderColor: "#0F172A" }}>
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>{initials}</Text>
        </View>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          {user?.name || "Student"}
        </Text>
        <Text style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>
          {user?.email || "student@college.edu"}
        </Text>
        {user?.college ? (
          <Text style={{ color: "#64748B", fontSize: 12, marginTop: 6 }}>
            🎓  {user.college}
            {user.department ? `  ·  ${user.department}` : ""}
          </Text>
        ) : null}
      </View>

      {/* Stats */}
      <View style={{ flexDirection: "row", marginHorizontal: 16, backgroundColor: "#1E293B", borderRadius: 20, borderWidth: 1, borderColor: "#334155", marginBottom: 20, overflow: "hidden" }}>
        {[
          { label: "Queries", value: "0", color: "#6366F1" },
          { label: "Answers", value: "0", color: "#10B981" },
          { label: "Votes", value: "0", color: "#F59E0B" },
        ].map((stat, i) => (
          <View key={stat.label} style={{ flex: 1, paddingVertical: 16, alignItems: "center", borderRightWidth: i < 2 ? 1 : 0, borderRightColor: "#334155" }}>
            <Text style={{ color: stat.color, fontSize: 22, fontWeight: "bold" }}>{stat.value}</Text>
            <Text style={{ color: "#64748B", fontSize: 11, marginTop: 2 }}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={{ marginHorizontal: 16, backgroundColor: "#1E293B", borderRadius: 20, borderWidth: 1, borderColor: "#334155", marginBottom: 20, overflow: "hidden" }}>
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < MENU_ITEMS.length - 1 ? 1 : 0, borderBottomColor: "#1E293B" }}
            onPress={() => item.route && router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "#0F172A", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>{item.label}</Text>
              <Text style={{ color: "#64748B", fontSize: 12, marginTop: 1 }}>{item.sub}</Text>
            </View>
            <Text style={{ color: "#475569", fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <View style={{ marginHorizontal: 16, marginBottom: 120 }}>
        <TouchableOpacity
          style={{ backgroundColor: "#EF444415", borderWidth: 1, borderColor: "#EF444430", borderRadius: 16, paddingVertical: 16, alignItems: "center" }}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#EF4444", fontWeight: "bold", fontSize: 15 }}>🚪  Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
