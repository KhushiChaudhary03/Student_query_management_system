import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, TextInput,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { C, R, S, T } from "../../components/theme";
import Header from "../../components/Header";
import InputBox from "../../components/InputBox";
import { PrimaryButton, GhostButton, ErrorBanner } from "../../components/Atoms";
import { postQuestion } from "../../firebase/questions";
import { currentUser, getUserProfile } from "../../firebase/auth";
import { AppSettings, DEFAULT_SETTINGS, subscribeToAppSettings } from "../../store/settings";

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Computer Science",
  "Data Structures", "Computer Networks", "Electrical Engineering",
  "Mechanical Engineering", "Economics", "Management",
];

export default function AskScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [college, setCollege] = useState("");
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const user = currentUser();
    if (user) {
      getUserProfile(user.uid).then(p => { if (p?.college) setCollege(p.college); });
    }
  }, []);

  useEffect(() => subscribeToAppSettings(setSettings), []);

  const f = (id: string) => ({
    isFocused: focused === id,
    onFocus: () => setFocused(id),
    onBlur: () => setFocused(""),
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!subject) e.subject = "Please select a subject.";
    if (!body.trim()) e.body = "Description is required.";
    else if (body.trim().length < 20) e.body = "Please describe in more detail (min 20 chars).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags(prev => [...prev, t]);
      setTagInput("");
    }
  };

  const reset = () => {
    setTitle("");
    setBody("");
    setSubject("");
    setTags([]);
    setTagInput("");
    setErrors({});
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await postQuestion({ title, body, subject, tags, college });
      reset();
      setLoading(false);
      Alert.alert("Posted", "Your question is now live.", [
        { text: "View Feed", onPress: () => router.push("/(tabs)/home") },
        { text: "My Questions", onPress: () => router.push("/(tabs)/my-queries") },
      ]);
    } catch (e: any) {
      setLoading(false);
      Alert.alert("Error", e?.message ?? "Could not post. Try again.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      <Header title="Ask a Question" subtitle={settings.compactMode ? "Compact compose mode is on" : "Clear questions get the best answers"} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <ScrollView
          contentContainerStyle={{ padding: settings.compactMode ? S.md : S.lg, paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          <View style={{
            backgroundColor: C.bg2,
            borderWidth: 1,
            borderColor: C.borderLight,
            borderRadius: R.lg,
            padding: settings.compactMode ? S.md : S.lg,
            marginBottom: settings.compactMode ? S.lg : S.xl,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: S.md }}>
              <View style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                backgroundColor: C.accentDim,
                borderWidth: 1,
                borderColor: C.accent + "40",
                alignItems: "center",
                justifyContent: "center",
                marginRight: S.md,
              }}>
                <Ionicons name="sparkles" size={20} color={C.accentText} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...T.h3, fontSize: 16 }}>Ask with context</Text>
                <Text style={{ ...T.small, color: C.t2, marginTop: 2 }}>
                  Mention the subject, what you tried, and the exact doubt.
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: C.bgSoft, borderRadius: R.md, padding: S.md, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ ...T.label, color: C.accentText, marginBottom: 6 }}>Feed Setting</Text>
              <Text style={{ ...T.small, color: C.t2 }}>
                {settings.hideSolvedQuestions
                  ? "Your home feed is currently set to hide solved questions."
                  : "Your home feed is currently showing both open and solved questions."}
              </Text>
            </View>
          </View>

          <InputBox
            label="Question Title *"
            placeholder="e.g. How does recursion work in Python?"
            value={title}
            onChangeText={v => { setTitle(v); setErrors(e => ({ ...e, title: "" })); }}
            maxLength={150}
            error={errors.title}
            {...f("title")}
          />
          <Text style={{ ...T.small, color: C.t2, textAlign: "right", marginTop: -S.md, marginBottom: settings.compactMode ? S.md : S.lg }}>
            {title.length}/150
          </Text>

          <Text style={{ ...T.label, marginBottom: S.sm }}>Subject *</Text>
          {errors.subject && <Text style={{ color: C.red, fontSize: 12, marginBottom: 6 }}>{errors.subject}</Text>}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: settings.compactMode ? S.md : S.lg }}>
            {SUBJECTS.map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => { setSubject(s); setErrors(e => ({ ...e, subject: "" })); }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: R.full,
                  borderWidth: 1.5,
                  backgroundColor: subject === s ? C.accent : C.bgSoft,
                  borderColor: subject === s ? C.accent : C.border,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: subject === s ? "#fff" : C.t2 }}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <InputBox
            label="Description *"
            placeholder={"Describe your problem:\n- What have you tried?\n- What did you expect?\n- What happened?"}
            multiline
            style={{ minHeight: settings.compactMode ? 120 : 140, textAlignVertical: "top" }}
            value={body}
            onChangeText={v => { setBody(v); setErrors(e => ({ ...e, body: "" })); }}
            error={errors.body}
            {...f("body")}
          />

          <Text style={{ ...T.label, marginBottom: S.sm }}>
            Tags <Text style={{ textTransform: "none", fontWeight: "400", letterSpacing: 0, color: C.t3 }}>(optional · up to 5)</Text>
          </Text>
          <View style={{
            flexDirection: "row",
            backgroundColor: C.bgSoft,
            borderRadius: R.md,
            borderWidth: 1.5,
            borderColor: focused === "tag" ? C.accent : C.border,
            overflow: "hidden",
            marginBottom: S.sm,
            alignItems: "center",
          }}>
            <TextInput
              placeholder="e.g. Recursion"
              placeholderTextColor={C.t3}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
              returnKeyType="done"
              onFocus={() => setFocused("tag")}
              onBlur={() => setFocused("")}
              style={{ flex: 1, color: C.t1, paddingHorizontal: S.lg, paddingVertical: 14, fontSize: 14 }}
            />
            <TouchableOpacity
              onPress={addTag}
              style={{ backgroundColor: C.accent, marginRight: 6, width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" }}
            >
              <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {tags.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: settings.compactMode ? S.md : S.lg }}>
              {tags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => setTags(tags.filter(t => t !== tag))}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: C.accentDim,
                    borderWidth: 1,
                    borderColor: C.accent + "40",
                    borderRadius: R.full,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    gap: 5,
                  }}
                >
                  <Text style={{ color: C.accentText, fontSize: 12, fontWeight: "600" }}>#{tag}</Text>
                  <Ionicons name="close" size={14} color={C.accent} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <ErrorBanner message={Object.values(errors).find(Boolean) || ""} />

          <View style={{ gap: S.md, marginTop: settings.compactMode ? S.md : S.lg }}>
            <PrimaryButton label="Post Question" onPress={submit} loading={loading} />
            <GhostButton label="Clear Form" onPress={reset} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
