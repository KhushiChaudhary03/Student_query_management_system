import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { C, R, S, T } from "../../components/theme";
import { Avatar, Divider } from "../../components/Atoms";
import { User, Question } from "../../components/types";

const MENU = [
  { icon: "📋", label: "My Questions",  sub: "View your posted questions", route: "/(tabs)/my-queries" },
  { icon: "🔔", label: "Notifications", sub: "Activity and replies",       route: "/(tabs)/notifications" },
  { icon: "💬", label: "My Answers",    sub: "Answers you have given",     route: null },
  { icon: "🔖", label: "Saved",         sub: "Bookmarked questions",       route: null },
  { icon: "⚙️", label: "Settings",      sub: "Account preferences",        route: null },
];

function StatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: bg, borderRadius: R.md, paddingVertical: 14,
      alignItems: "center", borderWidth: 1, borderColor: color + "25" }}>
      <Text style={{ color, fontSize: 24, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: C.t3, fontSize: 11, fontWeight: "600", marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const [user,      setUser]      = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const load = useCallback(async () => {
    const u = await AsyncStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    const q = await AsyncStorage.getItem("questions");
    setQuestions(q ? JSON.parse(q) : []);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const logout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out", style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove(["userToken", "user", "questions"]);
          router.replace("/(auth)/login" as any);
        },
      },
    ]);
  };

  const name        = user?.name || "Student";
  const totalVotes  = questions.reduce((acc, q) => acc + q.votes, 0);
  const answered    = questions.filter(q => q.answers > 0).length;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      {/* Header */}
      <View style={{ backgroundColor: C.bg1, paddingHorizontal: S.lg, paddingTop: 50,
        paddingBottom: S.lg, borderBottomWidth: 1, borderBottomColor: C.border,
        flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={T.h2}>Profile</Text>
        <TouchableOpacity
          style={{ backgroundColor: C.bg3, paddingHorizontal: 14, paddingVertical: 7,
            borderRadius: R.full, borderWidth: 1, borderColor: C.border }}
        >
          <Text style={{ color: C.t2, fontSize: 12, fontWeight: "700" }}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>

        {/* ── Profile identity card ─────────────────────────── */}
        <View style={{ margin: S.lg, backgroundColor: C.bg2, borderRadius: R.lg,
          padding: S.xxl, alignItems: "center", borderWidth: 1, borderColor: C.border }}>
          <Avatar name={name} size={72} />
          <Text style={{ ...T.h2, marginTop: S.lg, marginBottom: 4 }}>{name}</Text>
          <Text style={{ color: C.t3, fontSize: 13, marginBottom: S.sm }}>{user?.email || "—"}</Text>

          {user?.college ? (
            <View style={{ backgroundColor: C.accentDim, paddingHorizontal: 14, paddingVertical: 6,
              borderRadius: R.full, marginBottom: 4, borderWidth: 1, borderColor: C.accent + "30" }}>
              <Text style={{ color: C.accentText, fontSize: 12, fontWeight: "600" }}>🎓  {user.college}</Text>
            </View>
          ) : null}

          {user?.department ? (
            <Text style={{ color: C.t3, fontSize: 12, marginTop: 4 }}>{user.department}</Text>
          ) : null}
        </View>

        {/* ── Stats ─────────────────────────────────────────── */}
        <View style={{ flexDirection: "row", marginHorizontal: S.lg, gap: 10, marginBottom: S.lg }}>
          <StatCard label="Questions" value={questions.length} color={C.accent}  bg={C.accentDim}  />
          <StatCard label="Answered"  value={answered}         color={C.green}   bg={C.greenDim}   />
          <StatCard label="Votes got" value={totalVotes}       color={C.amber}   bg={C.amberDim}   />
        </View>

        {/* ── Recent activity ───────────────────────────────── */}
        {questions.length > 0 && (
          <View style={{ marginHorizontal: S.lg, marginBottom: S.lg }}>
            <Text style={{ ...T.label, marginBottom: S.sm }}>Recent Questions</Text>
            <View style={{ backgroundColor: C.bg2, borderRadius: R.lg,
              borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
              {questions.slice(0, 3).map((q, i) => (
                <TouchableOpacity
                  key={q.id}
                  onPress={() => router.push(`/query/${q.id}` as any)}
                  style={{ paddingHorizontal: S.lg, paddingVertical: S.md,
                    borderBottomWidth: i < Math.min(questions.length, 3) - 1 ? 1 : 0,
                    borderBottomColor: C.border, flexDirection: "row",
                    alignItems: "center", gap: S.sm }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: C.t1, fontSize: 13, fontWeight: "600", marginBottom: 2 }} numberOfLines={1}>
                      {q.title}
                    </Text>
                    <Text style={{ color: C.t3, fontSize: 11 }}>
                      {q.subject}  ·  {q.createdAt}  ·  {q.answers} answer{q.answers !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <Text style={{ color: C.border, fontSize: 18 }}>›</Text>
                </TouchableOpacity>
              ))}
              {questions.length > 3 && (
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/my-queries" as any)}
                  style={{ paddingHorizontal: S.lg, paddingVertical: S.md,
                    borderTopWidth: 1, borderTopColor: C.border, alignItems: "center" }}
                >
                  <Text style={{ color: C.accent, fontSize: 13, fontWeight: "600" }}>
                    View all {questions.length} questions →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ── Menu ──────────────────────────────────────────── */}
        <View style={{ marginHorizontal: S.lg, backgroundColor: C.bg2, borderRadius: R.lg,
          borderWidth: 1, borderColor: C.border, overflow: "hidden", marginBottom: S.lg }}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => item.route && router.push(item.route as any)}
              activeOpacity={item.route ? 0.7 : 1}
              style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: S.lg,
                paddingVertical: S.md + 2,
                borderBottomWidth: i < MENU.length - 1 ? 1 : 0, borderBottomColor: C.border }}
            >
              <View style={{ width: 38, height: 38, borderRadius: R.sm, backgroundColor: C.bg3,
                alignItems: "center", justifyContent: "center", marginRight: S.md }}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.t1, fontSize: 14, fontWeight: "600" }}>{item.label}</Text>
                <Text style={{ color: C.t3, fontSize: 12, marginTop: 1 }}>{item.sub}</Text>
              </View>
              {item.route && <Text style={{ color: C.border, fontSize: 20 }}>›</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── App info ──────────────────────────────────────── */}
        <View style={{ marginHorizontal: S.lg, backgroundColor: C.bg2, borderRadius: R.lg,
          borderWidth: 1, borderColor: C.border, overflow: "hidden", marginBottom: S.lg }}>
          {[
            { label: "App Version", value: "1.0.0" },
            { label: "Build",       value: "Production" },
          ].map((row, i) => (
            <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between",
              paddingHorizontal: S.lg, paddingVertical: S.md,
              borderBottomWidth: i === 0 ? 1 : 0, borderBottomColor: C.border }}>
              <Text style={{ color: C.t3, fontSize: 13 }}>{row.label}</Text>
              <Text style={{ color: C.t2, fontSize: 13, fontWeight: "600" }}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Logout ────────────────────────────────────────── */}
        <View style={{ marginHorizontal: S.lg }}>
          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.8}
            style={{ backgroundColor: C.redDim, borderWidth: 1.5, borderColor: C.red + "30",
              borderRadius: R.md, paddingVertical: 14, alignItems: "center" }}
          >
            <Text style={{ color: C.red, fontWeight: "700", fontSize: 15 }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
