import React, { useState, useRef, useCallback } from "react";
import {
  View, Text, ScrollView, KeyboardAvoidingView,
  Platform, ActivityIndicator, TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { C, R, S, T } from "../../components/theme";
import { BackHeader } from "../../components/Header";
import AnswerItem from "../../components/AnswerItem";
import InputBox from "../../components/InputBox";
import EmptyState from "../../components/EmptyState";
import { SubjectPill, Tag, VoteButton, PrimaryButton, Divider, Avatar } from "../../components/Atoms";
import { Question, Answer } from "../../components/types";
import { SEED_QUESTIONS } from "../../store/data";

export default function QueryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [question, setQuestion]   = useState<Question | null>(null);
  const [answerText, setAnswer]   = useState("");
  const [answerError, setAError]  = useState("");
  const [qVoted,  setQVoted]      = useState(false);
  const [aVotes,  setAVotes]      = useState<Record<string, boolean>>({});
  const [submitting, setSubmit]   = useState(false);
  const [focused, setFocused]     = useState(false);
  const [sortAnswers, setSortAns] = useState<"top" | "new">("top");
  const scrollRef = useRef<ScrollView>(null);

  const load = useCallback(async () => {
    const stored = await AsyncStorage.getItem("questions");
    const userQ: Question[] = stored ? JSON.parse(stored) : [];
    const found =
      userQ.find(q => q.id === id) ??
      SEED_QUESTIONS.find(q => q.id === id) ??
      null;
    setQuestion(found);
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const submitAnswer = async () => {
    if (!answerText.trim()) { setAError("Please write your answer."); return; }
    if (answerText.trim().length < 10) { setAError("Answer too short — please elaborate."); return; }
    setAError("");
    setSubmit(true);

    const raw  = await AsyncStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : { name: "You", college: "Your College" };

    const newAnswer: Answer = {
      id: `a_${Date.now()}`,
      author: user.name,
      college: user.college,
      body: answerText.trim(),
      votes: 0,
      isAccepted: false,
      createdAt: "Just now",
    };

    // Optimistic update — immediately reflects in UI
    if (question) {
      const updated: Question = {
        ...question,
        answersList: [...(question.answersList ?? []), newAnswer],
        answers: (question.answers ?? 0) + 1,
      };
      setQuestion(updated);

      // Persist only if it's a user-created question
      const stored = await AsyncStorage.getItem("questions");
      if (stored) {
        const all: Question[] = JSON.parse(stored);
        const idx = all.findIndex(q => q.id === id);
        if (idx !== -1) {
          all[idx] = updated;
          await AsyncStorage.setItem("questions", JSON.stringify(all));
        }
      }
    }

    setAnswer("");
    setSubmit(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
  };

  if (!question) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg0, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={C.accent} size="large" />
      </View>
    );
  }

  const answers = [...(question.answersList ?? [])].sort((a, b) => {
    if (sortAnswers === "top") {
      if (a.isAccepted && !b.isAccepted) return -1;
      if (!a.isAccepted && b.isAccepted) return 1;
      return b.votes - a.votes;
    }
    return 0; // "new" — keep insertion order
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg0 }} edges={["top"]}>
      <BackHeader title="Question" onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: S.lg, paddingBottom: 60 }}
        >
          {/* ── Question ──────────────────────────────────────── */}
          <View style={{
            backgroundColor: C.bg2, borderRadius: R.lg, padding: S.lg,
            borderWidth: 1, borderColor: C.border, marginBottom: S.lg,
            overflow: "hidden",
          }}>
            {/* Accepted bar */}
            {question.answersList?.some(a => a.isAccepted) && (
              <View style={{ height: 2.5, backgroundColor: C.green, marginHorizontal: -S.lg, marginTop: -S.lg, marginBottom: S.lg }} />
            )}

            {/* Subject + time */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.sm }}>
              <SubjectPill subject={question.subject} />
              <Text style={T.small}>{question.createdAt}</Text>
            </View>

            {/* Title */}
            <Text style={{ fontSize: 18, fontWeight: "800", color: C.t1, lineHeight: 26, marginBottom: S.sm }}>
              {question.title}
            </Text>

            {/* Full body */}
            <Text style={{ ...T.body, lineHeight: 23, marginBottom: S.lg }}>
              {question.body}
            </Text>

            {/* Tags */}
            {question.tags.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: S.lg }}>
                {question.tags.map(t => <Tag key={t} label={t} />)}
              </View>
            )}

            <Divider />

            {/* Author + vote */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: S.md }}>
              <Avatar name={question.author} size={32} />
              <View style={{ flex: 1, marginLeft: S.sm }}>
                <Text style={{ color: C.accentText, fontSize: 13, fontWeight: "600" }}>
                  {question.author}
                </Text>
                <Text style={{ color: C.t3, fontSize: 11 }}>{question.college}</Text>
              </View>
              <VoteButton
                count={question.votes}
                voted={qVoted}
                onPress={() => setQVoted(p => !p)}
              />
            </View>
          </View>

          {/* ── Answers header + sort ─────────────────────────── */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm }}>
              <Text style={T.h3}>
                {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
              </Text>
              {answers.some(a => a.isAccepted) && (
                <View style={{ backgroundColor: C.greenDim, paddingHorizontal: 8, paddingVertical: 3,
                  borderRadius: R.full, borderWidth: 1, borderColor: C.green + "30" }}>
                  <Text style={{ color: C.green, fontSize: 10, fontWeight: "700" }}>✓ SOLVED</Text>
                </View>
              )}
            </View>

            {/* Sort toggle */}
            {answers.length > 1 && (
              <View style={{ flexDirection: "row", backgroundColor: C.bg3,
                borderRadius: R.sm, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
                {(["top", "new"] as const).map(opt => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setSortAns(opt)}
                    style={{ paddingHorizontal: 10, paddingVertical: 5,
                      backgroundColor: sortAnswers === opt ? C.accent : "transparent" }}
                  >
                    <Text style={{ color: sortAnswers === opt ? "#fff" : C.t3,
                      fontSize: 11, fontWeight: "700", textTransform: "capitalize" }}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* ── Answer list ───────────────────────────────────── */}
          {answers.length === 0
            ? (
              <View style={{ marginBottom: S.lg }}>
                <EmptyState
                  emoji="🤔"
                  title="No answers yet"
                  body="Be the first to help this student!"
                />
              </View>
            )
            : answers.map(ans => (
              <AnswerItem
                key={ans.id}
                answer={ans}
                voted={!!aVotes[ans.id]}
                onVote={() => setAVotes(v => ({ ...v, [ans.id]: !v[ans.id] }))}
              />
            ))
          }

          {/* ── Write answer ──────────────────────────────────── */}
          <View style={{
            backgroundColor: C.bg2, borderRadius: R.lg, padding: S.lg,
            borderWidth: 1, borderColor: C.border, marginTop: S.sm,
          }}>
            <Text style={{ ...T.h3, marginBottom: 4 }}>Write Your Answer</Text>
            <Text style={{ ...T.small, marginBottom: S.md }}>
              Share your knowledge clearly. Examples help a lot.
            </Text>

            <InputBox
              placeholder={"Your answer here...\n\nTip: include steps, code snippets or examples."}
              multiline
              style={{ minHeight: 130, textAlignVertical: "top" }}
              value={answerText}
              onChangeText={v => { setAnswer(v); setAError(""); }}
              isFocused={focused}
              onFocus={() => {
                setFocused(true);
                setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 350);
              }}
              onBlur={() => setFocused(false)}
              error={answerError}
            />

            {/* Character count */}
            <Text style={{ ...T.small, textAlign: "right", marginTop: -S.md, marginBottom: S.md }}>
              {answerText.length} chars{answerText.length < 10 ? ` (min 10)` : ""}
            </Text>

            <PrimaryButton
              label="Submit Answer"
              onPress={submitAnswer}
              loading={submitting}
              disabled={answerText.trim().length < 10}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
