import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { C, R, S, T } from "../../components/theme";
import { BackHeader } from "../../components/Header";
import AnswerItem from "../../components/AnswerItem";
import InputBox from "../../components/InputBox";
import EmptyState from "../../components/EmptyState";
import BrandedLoader from "../../components/BrandedLoader";
import { SubjectPill, Tag, VoteButton, PrimaryButton, Divider, Avatar } from "../../components/Atoms";
import { Question, Answer } from "../../components/types";
import {
  subscribeToQuestion, voteQuestion, postAnswer,
  voteAnswer, acceptAnswer,
} from "../../firebase/questions";
import { createNotification } from "../../firebase/notifications";
import { currentUser, getUserProfile } from "../../firebase/auth";
import { AppSettings, DEFAULT_SETTINGS, subscribeToAppSettings } from "../../store/settings";
import { SavedQuestion, isQuestionSaved, toggleSavedQuestion } from "../../store/savedQuestions";

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

export default function QueryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswer] = useState("");
  const [answerErr, setAErr] = useState("");
  const [qVoted, setQVoted] = useState(false);
  const [aVotes, setAVotes] = useState<Record<string, boolean>>({});
  const [submitting, setSubmit] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sortAns, setSortAns] = useState<"top" | "new">("top");
  const [college, setCollege] = useState("");
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const user = currentUser();
    if (user) {
      getUserProfile(user.uid).then(p => { if (p?.college) setCollege(p.college); });
    }
  }, []);

  useEffect(() => subscribeToAppSettings(setSettings), []);

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToQuestion(id, async data => {
      setQuestion(data);
      setSaved(await isQuestionSaved(data.id));
      setLoading(false);
    });
    return unsub;
  }, [id]);

  const handleVoteQuestion = async () => {
    if (!question) return;
    const newVoted = !qVoted;
    setQVoted(newVoted);
    setQuestion(q => q ? { ...q, votes: q.votes + (newVoted ? 1 : -1) } : q);
    try {
      await voteQuestion(question.id, newVoted ? 1 : -1);
    } catch {
      setQVoted(!newVoted);
      setQuestion(q => q ? { ...q, votes: q.votes + (newVoted ? -1 : 1) } : q);
    }
  };

  const handleToggleSave = async () => {
    if (!question) return;
    const next = await toggleSavedQuestion(toSavedQuestion(question));
    setSaved(next);
  };

  const handleVoteAnswer = async (ans: Answer) => {
    const wasVoted = !!aVotes[ans.id];
    setAVotes(v => ({ ...v, [ans.id]: !wasVoted }));
    try {
      await voteAnswer(question!.id, ans.id, wasVoted ? -1 : 1);
    } catch {
      setAVotes(v => ({ ...v, [ans.id]: wasVoted }));
    }
  };

  const handleAccept = async (answerId: string) => {
    if (!question) return;
    const user = currentUser();
    if (user?.uid !== question.authorId) {
      Alert.alert("Not allowed", "Only the question author can accept an answer.");
      return;
    }
    try {
      await acceptAnswer(question.id, answerId);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not accept. Try again.");
    }
  };

  const submitAnswer = async () => {
    if (!answerText.trim()) { setAErr("Please write your answer."); return; }
    if (answerText.trim().length < 10) { setAErr("Answer too short - please elaborate."); return; }
    setAErr("");
    setSubmit(true);
    try {
      await postAnswer(question!.id, answerText.trim(), college);
      const user = currentUser();
      if (user && question && user.uid !== question.authorId) {
        await createNotification({
          toUserId: question.authorId,
          type: "answer",
          message: `${user.displayName ?? "Someone"} answered your question`,
          questionId: question.id,
          questionTitle: question.title,
          fromUserName: user.displayName ?? "Anonymous",
        });
      }
      setAnswer("");
      setSubmit(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    } catch (e: any) {
      setSubmit(false);
      Alert.alert("Error", e?.message ?? "Could not submit answer. Try again.");
    }
  };

  if (loading || !question) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg0 }}><BrandedLoader title="Loading the discussion" subtitle="Collecting the question, answers, and recent activity." compact /></View>
    );
  }

  const isAuthor = currentUser()?.uid === question.authorId;
  const answers = [...(question.answersList ?? [])].sort((a, b) => {
    if (sortAns === "top") {
      if (a.isAccepted && !b.isAccepted) return -1;
      if (!a.isAccepted && b.isAccepted) return 1;
      return b.votes - a.votes;
    }
    return 0;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg0 }} edges={["top"]}>
      <BackHeader title="Question" onBack={() => router.back()} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: settings.compactMode ? S.md : S.lg, paddingBottom: 60 }}>
          <View style={{ backgroundColor: C.bg2, borderRadius: 24, padding: settings.compactMode ? S.lg : S.xl, borderWidth: 1, borderColor: saved ? C.sun + "55" : C.border, marginBottom: settings.compactMode ? S.md : S.lg, overflow: "hidden", shadowColor: "#020817", shadowOpacity: 0.22, shadowOffset: { width: 0, height: 12 }, shadowRadius: 20, elevation: 5 }}>
            {question.answersList?.some(a => a.isAccepted) && (
              <View style={{ height: 3, backgroundColor: C.green, marginHorizontal: -(settings.compactMode ? S.lg : S.xl), marginTop: -(settings.compactMode ? S.lg : S.xl), marginBottom: S.lg }} />
            )}

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.sm }}>
              <SubjectPill subject={question.subject} />
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <TouchableOpacity
                  onPress={handleToggleSave}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: saved ? C.sunDim : C.bgSoft,
                    borderWidth: 1,
                    borderColor: saved ? C.sun + "35" : C.border,
                  }}
                >
                  <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={16} color={saved ? C.sun : C.t3} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="time-outline" size={12} color={C.t3} />
                  <Text style={T.small}>{question.createdAt}</Text>
                </View>
              </View>
            </View>

            <Text style={{ fontSize: 22, fontWeight: "800", color: C.t1, lineHeight: 30, marginBottom: S.sm }}>
              {question.title}
            </Text>

            <Text style={{ ...T.body, color: C.t2, lineHeight: 24, marginBottom: S.lg }}>{question.body}</Text>

            {question.tags.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: S.lg }}>
                {question.tags.map(t => <Tag key={t} label={t} />)}
              </View>
            )}

            <View style={{ marginBottom: S.md }}>
              <View style={{ backgroundColor: saved ? C.sunDim : C.bgSoft, borderRadius: R.full, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: saved ? C.sun + "30" : C.border, alignSelf: "flex-start" }}>
                <Text style={{ color: saved ? C.sun : C.t2, fontSize: 11, fontWeight: "700" }}>
                  {saved ? "Saved to your profile bookmarks" : "Tap bookmark to save this question"}
                </Text>
              </View>
            </View>

            <Divider />

            <View style={{ flexDirection: "row", alignItems: "center", marginTop: S.md }}>
              <Avatar name={question.authorName} size={34} />
              <View style={{ flex: 1, marginLeft: S.sm }}>
                <Text style={{ color: C.accentText, fontSize: 13, fontWeight: "700" }}>{question.authorName}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <Ionicons name="school-outline" size={11} color={C.t3} />
                  <Text style={{ color: C.t3, fontSize: 11 }}>{question.college}</Text>
                </View>
              </View>
              <VoteButton count={question.votes} voted={qVoted} onPress={handleVoteQuestion} />
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm }}>
              <Text style={{ ...T.h3, fontSize: 18 }}>{answers.length} {answers.length === 1 ? "Answer" : "Answers"}</Text>
              {answers.some(a => a.isAccepted) && (
                <View style={{ backgroundColor: C.greenDim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.full, borderWidth: 1, borderColor: C.green + "30" }}>
                  <Text style={{ color: C.green, fontSize: 10, fontWeight: "800" }}>SOLVED</Text>
                </View>
              )}
            </View>
            {answers.length > 1 && (
              <View style={{ flexDirection: "row", backgroundColor: C.bgSoft, borderRadius: R.sm, borderWidth: 1, borderColor: C.border, overflow: "hidden" }}>
                {(["top", "new"] as const).map(opt => (
                  <TouchableOpacity key={opt} onPress={() => setSortAns(opt)} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: sortAns === opt ? C.cyan : "transparent" }}>
                    <Text style={{ color: sortAns === opt ? "#fff" : C.t3, fontSize: 11, fontWeight: "800", textTransform: "capitalize" }}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {answers.length === 0
            ? <View style={{ marginBottom: settings.compactMode ? S.md : S.lg }}>
                <EmptyState emoji="\u{1F914}" title="No answers yet" body="Be the first to help and move this question forward." />
              </View>
            : answers.map(ans => (
                <View key={ans.id}>
                  <AnswerItem answer={ans} voted={!!aVotes[ans.id]} onVote={() => handleVoteAnswer(ans)} />
                  {isAuthor && !ans.isAccepted && (
                    <TouchableOpacity onPress={() => handleAccept(ans.id)} style={{ marginTop: -S.sm, marginBottom: S.md, alignSelf: "flex-end", backgroundColor: C.greenDim, paddingHorizontal: 14, paddingVertical: 7, borderRadius: R.full, borderWidth: 1, borderColor: C.green + "30", flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Ionicons name="checkmark-circle" size={14} color={C.green} />
                      <Text style={{ color: C.green, fontSize: 12, fontWeight: "700" }}>Accept this answer</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

          <View style={{ backgroundColor: C.bg2, borderRadius: 22, padding: settings.compactMode ? S.md : S.lg, borderWidth: 1, borderColor: C.border, marginTop: S.sm, shadowColor: "#020817", shadowOpacity: 0.18, shadowOffset: { width: 0, height: 10 }, shadowRadius: 18, elevation: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: S.sm }}>
              <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: C.cyanDim, borderWidth: 1, borderColor: C.cyan + "30", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="create-outline" size={20} color={C.cyan} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...T.h3, fontSize: 16 }}>Write Your Answer</Text>
                <Text style={{ ...T.small, color: C.t2 }}>Share steps, examples, or a clear explanation.</Text>
              </View>
            </View>
            <InputBox
              placeholder={"Your answer here...\n\nTip: include steps or examples."}
              multiline
              style={{ minHeight: settings.compactMode ? 116 : 130, textAlignVertical: "top" }}
              value={answerText}
              onChangeText={v => { setAnswer(v); setAErr(""); }}
              isFocused={focused}
              onFocus={() => {
                setFocused(true);
                setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 350);
              }}
              onBlur={() => setFocused(false)}
              error={answerErr}
            />
            <Text style={{ ...T.small, color: C.t2, textAlign: "right", marginTop: -S.md, marginBottom: S.md }}>
              {answerText.length} chars{answerText.length < 10 ? " (min 10)" : ""}
            </Text>
            <PrimaryButton label="Submit Answer" onPress={submitAnswer} loading={submitting} disabled={answerText.trim().length < 10} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
