import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { C, R, S, T } from "../../components/theme";
import Header from "../../components/Header";
import { SubjectPill, StatusBadge } from "../../components/Atoms";
import EmptyState from "../../components/EmptyState";
import BrandedLoader from "../../components/BrandedLoader";
import { Question } from "../../components/types";
import { fetchMyQuestions, deleteQuestion } from "../../firebase/questions";
import { AppSettings, DEFAULT_SETTINGS, subscribeToAppSettings } from "../../store/settings";

function StatBox({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: bg, borderRadius: R.md, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: color + "25" }}>
      <Text style={{ color, fontSize: 22, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: C.t3, fontSize: 11, fontWeight: "600", marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export default function MyQueriesScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const load = useCallback(async () => {
    try {
      const data = await fetchMyQuestions();
      setQuestions(data);
    } catch (e) {
      console.error("Failed to load my questions:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => subscribeToAppSettings(setSettings), []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Question", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteQuestion(id);
            setQuestions(prev => prev.filter(q => q.id !== id));
          } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Could not delete. Try again.");
          }
        },
      },
    ]);
  };

  const answered = questions.filter(q => q.answers > 0).length;

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg0 }}>
        <Header title="My Questions" />
        <BrandedLoader title="Loading your questions" subtitle="Gathering everything you have posted so far." compact />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      <Header title="My Questions" subtitle={`${questions.length} posted`} />

      <FlatList
        data={questions}
        keyExtractor={q => q.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: settings.compactMode ? S.md : S.lg, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
        ListHeaderComponent={
          questions.length > 0 ? (
            <View style={{ flexDirection: "row", gap: 10, marginBottom: settings.compactMode ? S.md : S.lg }}>
              <StatBox label="Total" value={questions.length} color={C.accent} bg={C.accentDim} />
              <StatBox label="Answered" value={answered} color={C.accentAlt} bg={C.accentAltDim} />
              <StatBox label="Pending" value={questions.length - answered} color={C.sun} bg={C.sunDim} />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/query/${item.id}` as any)}
            activeOpacity={0.88}
            style={{ backgroundColor: C.bg2, borderRadius: 22, padding: settings.compactMode ? S.md : S.lg, marginBottom: settings.compactMode ? S.md : S.lg, borderWidth: 1, borderColor: C.border, shadowColor: "#020817", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 10 }, shadowRadius: 18, elevation: 4 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <StatusBadge answered={item.answers > 0} />
                <SubjectPill subject={item.subject} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="time-outline" size={12} color={C.t3} />
                <Text style={T.small}>{item.createdAt}</Text>
              </View>
            </View>

            <Text style={{ ...T.h3, fontSize: 17, marginBottom: S.sm }} numberOfLines={2}>{item.title}</Text>
            <Text style={{ ...T.body, marginBottom: S.md }} numberOfLines={2}>{item.body}</Text>

            <View style={{ height: 1, backgroundColor: C.border, marginBottom: S.md }} />

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: S.lg }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="arrow-up" size={13} color={C.rose} />
                  <Text style={{ color: C.t2, fontSize: 12, fontWeight: "700" }}>{item.votes}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="chatbubble-ellipses-outline" size={13} color={item.answers > 0 ? C.accentAlt : C.t3} />
                  <Text style={{ color: item.answers > 0 ? C.accentAlt : C.t3, fontSize: 12, fontWeight: "700" }}>{item.answers}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ backgroundColor: C.redDim, paddingHorizontal: 12, paddingVertical: 7, borderRadius: R.sm, borderWidth: 1, borderColor: C.red + "25", flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="trash-outline" size={13} color={C.red} />
                <Text style={{ color: C.red, fontSize: 12, fontWeight: "700" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<EmptyState icon="document-text-outline" iconColor={C.rose} iconBg={C.roseDim} title="No questions yet" body="Post your first question and get help from peers." action="Ask a Question" onAction={() => router.push("/(tabs)/ask" as any)} />}
      />
    </View>
  );
}
