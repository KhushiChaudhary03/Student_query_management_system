import React, { useState, useCallback } from "react";
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  RefreshControl, Pressable,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { C, R, S, T } from "../../components/theme";
import QuestionCard from "../../components/QuestionCard";
import EmptyState from "../../components/EmptyState";
import { Avatar } from "../../components/Atoms";
import { Question } from "../../components/types";
import { SEED_QUESTIONS } from "../../store/data";

const FILTERS = [
  "All",
  "Mathematics",
  "Computer Science",
  "Data Structures",
  "Computer Networks",
  "Electrical Engineering",
  "Physics",
  "Economics",
];

const SORT_OPTIONS = ["Newest", "Most Voted", "Unanswered"];

export default function HomeScreen() {
  const [questions, setQuestions]   = useState<Question[]>(SEED_QUESTIONS);
  const [search,    setSearch]      = useState("");
  const [filter,    setFilter]      = useState("All");
  const [sort,      setSort]        = useState("Newest");
  const [showSort,  setShowSort]    = useState(false);
  const [initials,  setInitials]    = useState("?");
  const [votes,     setVotes]       = useState<Record<string, boolean>>({});
  const [refreshing,setRefreshing]  = useState(false);

  const load = useCallback(async () => {
    const u = await AsyncStorage.getItem("user");
    if (u) {
      const user = JSON.parse(u);
      setInitials(
        user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"
      );
    }
    const q = await AsyncStorage.getItem("questions");
    const userQ: Question[] = q ? JSON.parse(q) : [];
    setQuestions([...userQ, ...SEED_QUESTIONS]);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  // Filter + sort
  const processed = questions
    .filter(q => {
      const s = search.toLowerCase();
      const matchSearch = !s
        || q.title.toLowerCase().includes(s)
        || q.body.toLowerCase().includes(s)
        || q.tags.some(t => t.toLowerCase().includes(s))
        || q.author.toLowerCase().includes(s)
        || q.subject.toLowerCase().includes(s);
      const matchFilter = filter === "All" || q.subject === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sort === "Most Voted")  return b.votes - a.votes;
      if (sort === "Unanswered")  return a.answers - b.answers;
      return 0; // Newest — already ordered newest first
    });

  const ListHeader = (
    <View>
      {/* ── Ask CTA banner ─────────────────────────────────── */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/ask" as any)}
        activeOpacity={0.85}
        style={{
          backgroundColor: C.accentDim,
          borderRadius: R.lg,
          borderWidth: 1,
          borderColor: C.accent + "40",
          padding: S.lg,
          marginBottom: S.lg,
          flexDirection: "row",
          alignItems: "center",
          gap: S.md,
        }}
      >
        <View style={{
          width: 42, height: 42, borderRadius: R.md,
          backgroundColor: C.accent,
          alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Text style={{ fontSize: 20 }}>✏️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.t1, fontSize: 14, fontWeight: "700", marginBottom: 2 }}>
            Have a question?
          </Text>
          <Text style={{ color: C.t3, fontSize: 12 }}>
            Ask the community — get answers fast
          </Text>
        </View>
        <Text style={{ color: C.accent, fontSize: 20 }}>→</Text>
      </TouchableOpacity>

      {/* ── Sort + count row ───────────────────────────────── */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.sm }}>
        <Text style={{ ...T.label, color: C.t3 }}>
          {processed.length} {processed.length === 1 ? "question" : "questions"}
          {filter !== "All" ? `  ·  ${filter}` : ""}
        </Text>

        {/* Sort picker */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={() => setShowSort(p => !p)}
            style={{
              flexDirection: "row", alignItems: "center", gap: 5,
              backgroundColor: C.bg3, paddingHorizontal: 10, paddingVertical: 5,
              borderRadius: R.sm, borderWidth: 1, borderColor: C.border,
            }}
          >
            <Text style={{ color: C.t2, fontSize: 12, fontWeight: "600" }}>{sort}</Text>
            <Text style={{ color: C.t3, fontSize: 10 }}>{showSort ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          {showSort && (
            <View style={{
              position: "absolute", right: 0, top: 32, zIndex: 999,
              backgroundColor: C.bg2, borderRadius: R.md,
              borderWidth: 1, borderColor: C.border,
              minWidth: 130, overflow: "hidden",
              shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4, shadowRadius: 8, elevation: 12,
            }}>
              {SORT_OPTIONS.map((opt, i) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => { setSort(opt); setShowSort(false); }}
                  style={{
                    paddingHorizontal: S.md, paddingVertical: 11,
                    borderBottomWidth: i < SORT_OPTIONS.length - 1 ? 1 : 0,
                    borderBottomColor: C.border,
                    backgroundColor: sort === opt ? C.accentDim : "transparent",
                  }}
                >
                  <Text style={{ color: sort === opt ? C.accent : C.t2, fontSize: 13, fontWeight: sort === opt ? "700" : "400" }}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>

      {/* ── App header ─────────────────────────────────────── */}
      <View style={{
        backgroundColor: C.bg1,
        paddingHorizontal: S.lg,
        paddingTop: 50,
        paddingBottom: S.lg,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
      }}>
        {/* Title + avatar */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.lg }}>
          <View>
            <Text style={{ ...T.h2, letterSpacing: -0.3 }}>CampusQuery</Text>
            <Text style={T.small}>Ask · Answer · Learn</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile" as any)}>
            <Avatar name={initials || "U"} size={38} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={{
          flexDirection: "row", alignItems: "center",
          backgroundColor: C.bg2, borderRadius: R.md,
          paddingHorizontal: S.md, borderWidth: 1, borderColor: C.border,
        }}>
          <Text style={{ color: C.t3, fontSize: 16, marginRight: 6 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, color: C.t1, fontSize: 14, paddingVertical: 10 }}
            placeholder="Search questions, tags, subjects…"
            placeholderTextColor={C.t3}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} style={{ padding: 4 }}>
              <Text style={{ color: C.t3, fontSize: 15 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Subject filter chips ───────────────────────────── */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.border }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={i => i}
          contentContainerStyle={{ paddingHorizontal: S.lg, paddingVertical: S.sm, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setFilter(item)}
              style={{
                paddingHorizontal: 14, paddingVertical: 6,
                borderRadius: R.full, borderWidth: 1.5,
                backgroundColor: filter === item ? C.accent : "transparent",
                borderColor: filter === item ? C.accent : C.border,
              }}
            >
              <Text style={{
                fontSize: 12, fontWeight: "700",
                color: filter === item ? "#fff" : C.t3,
              }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ── Feed ────────────────────────────────────────────── */}
      <Pressable style={{ flex: 1 }} onPress={() => setShowSort(false)}>
        <FlatList
          data={processed}
          keyExtractor={q => q.id}
          renderItem={({ item }) => (
            <QuestionCard
              question={item}
              voted={!!votes[item.id]}
              onPress={() => router.push(`/query/${item.id}` as any)}
              onVote={() => setVotes(v => ({ ...v, [item.id]: !v[item.id] }))}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: S.lg, paddingTop: S.md, paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
          }
          ListEmptyComponent={
            <EmptyState
              emoji="🔍"
              title="No questions found"
              body={search ? `No results for "${search}"` : "Be the first to post a question!"}
              action={search ? "Clear search" : "Ask a Question"}
              onAction={search ? () => setSearch("") : () => router.push("/(tabs)/ask" as any)}
            />
          }
        />
      </Pressable>
    </View>
  );
}
