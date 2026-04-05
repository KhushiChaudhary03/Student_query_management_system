import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { C, R, S, T } from "../../components/theme";
import Header from "../../components/Header";
import { SubjectPill, StatusBadge } from "../../components/Atoms";
import EmptyState from "../../components/EmptyState";
import { Question } from "../../components/types";

function StatBox({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: bg, borderRadius: R.md, paddingVertical: 14,
      alignItems: "center", borderWidth: 1, borderColor: color + "25" }}>
      <Text style={{ color, fontSize: 22, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: C.t3, fontSize: 11, fontWeight: "600", marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export default function MyQueriesScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const q = await AsyncStorage.getItem("questions");
    setQuestions(q ? JSON.parse(q) : []);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const deleteQ = (id: string) => {
    Alert.alert("Delete Question", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        const updated = questions.filter(q => q.id !== id);
        setQuestions(updated);
        await AsyncStorage.setItem("questions", JSON.stringify(updated));
      }},
    ]);
  };

  const answered = questions.filter(q => q.answers > 0).length;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      <Header title="My Questions" subtitle={`${questions.length} posted`} />

      <FlatList
        data={questions}
        keyExtractor={q => q.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: S.lg, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
        ListHeaderComponent={questions.length > 0 ? (
          <View style={{ flexDirection: "row", gap: 10, marginBottom: S.lg }}>
            <StatBox label="Total"    value={questions.length}           color={C.accent} bg={C.accentDim} />
            <StatBox label="Answered" value={answered}                   color={C.green}  bg={C.greenDim}  />
            <StatBox label="Pending"  value={questions.length - answered} color={C.amber}  bg={C.amberDim}  />
          </View>
        ) : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/query/${item.id}` as any)}
            activeOpacity={0.78}
            style={{ backgroundColor: C.bg2, borderRadius: R.lg, padding: S.lg,
              marginBottom: S.md, borderWidth: 1, borderColor: C.border }}
          >
            {/* Row 1 */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <StatusBadge answered={item.answers > 0} />
                <SubjectPill subject={item.subject} />
              </View>
              <Text style={T.small}>{item.createdAt}</Text>
            </View>

            <Text style={{ ...T.h3, marginBottom: S.sm }} numberOfLines={2}>{item.title}</Text>
            <Text style={{ ...T.body, marginBottom: S.md }} numberOfLines={2}>{item.body}</Text>

            <View style={{ height: 1, backgroundColor: C.border, marginBottom: S.md }} />

            {/* Stats + delete */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: S.lg }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Text style={{ color: C.t3, fontSize: 13 }}>▲</Text>
                  <Text style={{ color: C.t3, fontSize: 12, fontWeight: "700" }}>{item.votes}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Text style={{ fontSize: 12 }}>💬</Text>
                  <Text style={{ color: item.answers > 0 ? C.green : C.t3, fontSize: 12, fontWeight: "700" }}>{item.answers}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => deleteQ(item.id)}
                style={{ backgroundColor: C.redDim, paddingHorizontal: 10, paddingVertical: 5,
                  borderRadius: R.xs, borderWidth: 1, borderColor: C.red + "25" }}>
                <Text style={{ color: C.red, fontSize: 12, fontWeight: "600" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState emoji="📭" title="No questions yet"
            body="Post your first question and get help from peers!"
            action="Ask a Question"
            onAction={() => router.push("/(tabs)/ask" as any)} />
        }
      />
    </View>
  );
}
