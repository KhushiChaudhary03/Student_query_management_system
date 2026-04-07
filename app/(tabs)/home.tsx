import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Pressable,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { C, R, S, T } from "../../components/theme";
import QuestionCard from "../../components/QuestionCard";
import EmptyState from "../../components/EmptyState";
import { Avatar } from "../../components/Atoms";
import PressableScale from "../../components/PressableScale";
import BrandedLoader from "../../components/BrandedLoader";
import { Question } from "../../components/types";
import { fetchQuestions, voteQuestion } from "../../firebase/questions";
import { currentUser, getUserProfile } from "../../firebase/auth";
import { AppSettings, DEFAULT_SETTINGS, subscribeToAppSettings } from "../../store/settings";
import { SavedQuestion, subscribeToSavedQuestions, toggleSavedQuestion } from "../../store/savedQuestions";

const FILTERS = [
  "All", "Mathematics", "Computer Science", "Data Structures",
  "Computer Networks", "Electrical Engineering", "Physics", "Economics",
];
const SORT_OPTIONS = ["Newest", "Most Voted", "Unanswered"] as const;
type SortOption = typeof SORT_OPTIONS[number];

function toSavedQuestion(question: Question): SavedQuestion {
  return {
    id: question.id,
    title: question.title,
    subject: question.subject,
    college: question.college,
    createdAt: question.createdAt,
    answers: question.answers,
    votes: question.votes,
  };
}

export default function HomeScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState<SortOption>("Newest");
  const [showSort, setShowSort] = useState(false);
  const [initials, setInitials] = useState("?");
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const load = useCallback(async () => {
    try {
      const user = currentUser();
      if (user) {
        const profile = await getUserProfile(user.uid);
        const name = profile?.name || user.displayName || "?";
        setInitials(name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2));
      }
      const data = await fetchQuestions(50);
      setQuestions(data);
    } catch (e) {
      console.error("Failed to load questions:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => subscribeToAppSettings(setSettings), []);
  useEffect(() => subscribeToSavedQuestions(items => {
    const next: Record<string, boolean> = {};
    items.forEach(item => { next[item.id] = true; });
    setSavedIds(next);
  }), []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleVote = async (questionId: string) => {
    const alreadyVoted = !!votes[questionId];
    setVotes(v => ({ ...v, [questionId]: !alreadyVoted }));
    setQuestions(qs => qs.map(q =>
      q.id === questionId
        ? { ...q, votes: q.votes + (alreadyVoted ? -1 : 1) }
        : q,
    ));
    try {
      await voteQuestion(questionId, alreadyVoted ? -1 : 1);
    } catch {
      setVotes(v => ({ ...v, [questionId]: alreadyVoted }));
      setQuestions(qs => qs.map(q =>
        q.id === questionId
          ? { ...q, votes: q.votes + (alreadyVoted ? 1 : -1) }
          : q,
      ));
    }
  };

  const handleToggleSave = async (question: Question) => {
    await toggleSavedQuestion(toSavedQuestion(question));
  };

  const processed = questions
    .filter(q => {
      const s = search.toLowerCase();
      const matchSearch = !s
        || q.title.toLowerCase().includes(s)
        || q.body.toLowerCase().includes(s)
        || q.tags.some(t => t.toLowerCase().includes(s))
        || q.authorName.toLowerCase().includes(s)
        || q.subject.toLowerCase().includes(s);
      const matchFilter = filter === "All" || q.subject === filter;
      const matchSolved = !settings.hideSolvedQuestions || !(q.answers > 0 || q.answersList?.some(a => a.isAccepted));
      return matchSearch && matchFilter && matchSolved;
    })
    .sort((a, b) => {
      if (sort === "Most Voted") return b.votes - a.votes;
      if (sort === "Unanswered") return a.answers - b.answers;
      return 0;
    });

  const SortModal = (
    <Modal transparent visible={showSort} animationType="fade" onRequestClose={() => setShowSort(false)}>
      <Pressable style={{ flex: 1 }} onPress={() => setShowSort(false)}>
        <View style={{ position: "absolute", top: 148, right: S.lg, backgroundColor: C.bg2, borderRadius: R.md, borderWidth: 1, borderColor: C.border, minWidth: 150, overflow: "hidden", elevation: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12 }}>
          {SORT_OPTIONS.map((opt, i) => (
            <TouchableOpacity key={opt} onPress={() => { setSort(opt); setShowSort(false); }} style={{ paddingHorizontal: S.lg, paddingVertical: 13, borderBottomWidth: i < SORT_OPTIONS.length - 1 ? 1 : 0, borderBottomColor: C.border, backgroundColor: sort === opt ? C.cyanDim : "transparent", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: sort === opt ? C.cyan : C.t1, fontSize: 14, fontWeight: sort === opt ? "700" : "400" }}>{opt}</Text>
              {sort === opt && <Ionicons name="checkmark" size={16} color={C.cyan} />}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  const ListHeader = (
    <View>
      <View style={{ marginBottom: settings.compactMode ? S.md : S.lg }}>
        <Text style={{ ...T.h1, fontSize: 30, marginBottom: 6 }}>CampusQuery</Text>
        <Text style={{ color: C.t2, fontSize: 14, fontWeight: "500" }}>Ask. Connect. Resolve.</Text>
      </View>

      <PressableScale
        onPress={() => router.push("/(tabs)/ask" as any)}
        activeScale={0.98}
        style={{
          backgroundColor: C.bg2,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: C.rose + "35",
          padding: settings.compactMode ? S.md : S.lg,
          marginBottom: settings.compactMode ? S.md : S.lg,
          flexDirection: "row",
          alignItems: "center",
          gap: S.md,
          shadowColor: "#020817",
          shadowOpacity: 0.22,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 18,
          elevation: 5,
        }}
      >
        <View style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: C.rose, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="create-outline" size={22} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.t1, fontSize: 15, fontWeight: "800", marginBottom: 2 }}>Have a question?</Text>
          <Text style={{ color: C.t2, fontSize: 12 }}>Start a thread and get help from your campus network.</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color={C.rose} />
      </PressableScale>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.sm }}>
        <Text style={{ ...T.label, color: C.t3 }}>
          {processed.length} {processed.length === 1 ? "question" : "questions"}
          {filter !== "All" ? `  ·  ${filter}` : ""}
          {settings.hideSolvedQuestions ? "  ·  unsolved only" : ""}
        </Text>
        <TouchableOpacity onPress={() => setShowSort(p => !p)} style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.bgSoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: R.sm, borderWidth: 1, borderColor: C.border }}>
          <Text style={{ color: C.t2, fontSize: 12, fontWeight: "600" }}>{sort}</Text>
          <Ionicons name={showSort ? "chevron-up" : "chevron-down"} size={12} color={C.t3} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      {SortModal}

      <View style={{ backgroundColor: C.bg1, paddingHorizontal: S.lg, paddingTop: 50, paddingBottom: S.lg, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: settings.compactMode ? S.md : S.lg }}>
          <View>
            <Text style={{ color: C.t3, fontSize: 12, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase" }}>Community Feed</Text>
            <Text style={{ ...T.small, color: C.t2, marginTop: 4 }}>
              {settings.hideSolvedQuestions ? "Showing open questions only." : "Your latest campus discussions, all in one place."}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile" as any)}>
            <Avatar name={initials || "U"} size={42} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: C.bgSoft, borderRadius: 16, paddingHorizontal: S.md, borderWidth: 1, borderColor: C.borderLight }}>
          <Ionicons name="search" size={16} color={C.t3} style={{ marginRight: 6 }} />
          <TextInput
            style={{ flex: 1, color: C.t1, fontSize: 14, paddingVertical: 12 }}
            placeholder="Search questions, tags, subjects..."
            placeholderTextColor={C.t3}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} style={{ padding: 4 }}>
              <Ionicons name="close" size={15} color={C.t3} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ borderBottomWidth: 1, borderBottomColor: C.border }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={i => i}
          contentContainerStyle={{ paddingHorizontal: S.lg, paddingVertical: settings.compactMode ? S.xs : S.sm, gap: 8 }}
          renderItem={({ item }) => {
            const activeColor = item === "Mathematics" ? C.sun : item === "Physics" ? C.cyan : item === "Economics" ? C.accentAlt : C.accent;
            const selected = filter === item;
            return (
              <PressableScale
                onPress={() => setFilter(item)}
                activeScale={0.96}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: R.full,
                  borderWidth: 1.5,
                  backgroundColor: selected ? activeColor : C.bgSoft,
                  borderColor: selected ? activeColor : C.border,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: selected ? "#fff" : C.t2 }}>{item}</Text>
              </PressableScale>
            );
          }}
        />
      </View>

      {loading ? (
        <BrandedLoader title="Loading the feed" subtitle="Pulling in fresh campus questions for you." />
      ) : (
        <FlatList
          data={processed}
          keyExtractor={q => q.id}
          renderItem={({ item }) => (
            <QuestionCard
              question={item}
              voted={!!votes[item.id]}
              saved={!!savedIds[item.id]}
              compact={settings.compactMode}
              onPress={() => router.push(`/query/${item.id}` as any)}
              onVote={() => handleVote(item.id)}
              onToggleSave={() => handleToggleSave(item)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: S.lg, paddingTop: settings.compactMode ? S.sm : S.md, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeader}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
          ListEmptyComponent={
            <EmptyState
              icon={settings.hideSolvedQuestions ? "checkmark-done-outline" : undefined}
              emoji={settings.hideSolvedQuestions ? undefined : (search ? "\u{1F50E}" : "\u{1F4AD}")}
              title={search ? "No results found" : settings.hideSolvedQuestions ? "No open questions" : "No questions yet"}
              body={search ? `No results for "${search}"` : settings.hideSolvedQuestions ? "Every visible question is already solved. Turn the filter off in settings to see all threads." : "Be the first to ask a question!"}
              action={search ? "Clear search" : "Ask a Question"}
              onAction={search ? () => setSearch("") : () => router.push("/(tabs)/ask" as any)}
            />
          }
        />
      )}

      <PressableScale
        onPress={() => router.push("/(tabs)/ask" as any)}
        activeScale={0.96}
        style={{
          position: "absolute",
          right: S.lg,
          bottom: 92,
          backgroundColor: C.rose,
          borderRadius: 999,
          paddingHorizontal: 18,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          shadowColor: C.rose,
          shadowOpacity: 0.38,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 18,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={18} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "800" }}>Ask Query</Text>
      </PressableScale>
    </View>
  );
}
