import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { C, R, S, T } from "../../components/theme";
import Header from "../../components/Header";
import InputBox from "../../components/InputBox";
import { PrimaryButton, GhostButton, ErrorBanner, Tag } from "../../components/Atoms";
const SUBJECTS = [
  "Mathematics","Physics","Chemistry","Computer Science",
  "Data Structures","Computer Networks","Electrical Engineering",
  "Mechanical Engineering","Economics","Management",
];

export default function AskScreen() {
  const [title,    setTitle]    = useState("");
  const [body,     setBody]     = useState("");
  const [subject,  setSubject]  = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags,     setTags]     = useState<string[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState("");
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const f = (id: string) => ({
    isFocused: focused === id,
    onFocus:   () => setFocused(id),
    onBlur:    () => setFocused(""),
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim())          e.title = "Title is required.";
    if (!subject)               e.subject = "Please select a subject.";
    if (!body.trim())           e.body = "Description is required.";
    else if (body.trim().length < 20) e.body = "Please describe in more detail (min 20 chars).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t) && tags.length < 5) { setTags(prev => [...prev, t]); setTagInput(""); }
  };

  const reset = () => { setTitle(""); setBody(""); setSubject(""); setTags([]); setErrors({}); };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const raw  = await AsyncStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : { name: "Anonymous", college: "Unknown" };
      const q = {
        id: `uq_${Date.now()}`,
        title: title.trim(), body: body.trim(),
        subject, tags, author: user.name, college: user.college,
        votes: 0, answers: 0, answersList: [], createdAt: "Just now",
      };
      const stored = await AsyncStorage.getItem("questions");
      const all = stored ? JSON.parse(stored) : [];
      all.unshift(q);
      await AsyncStorage.setItem("questions", JSON.stringify(all));
      reset();
      setLoading(false);
      Alert.alert("Posted! 🎉", "Your question is now live.", [
        { text: "View Feed",    onPress: () => router.push("/(tabs)/home") },
        { text: "My Questions", onPress: () => router.push("/(tabs)/my-queries") },
      ]);
    } catch {
      setLoading(false);
      Alert.alert("Error", "Could not post. Try again.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      <Header title="Ask a Question" subtitle="Clear questions get the best answers" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={20}>
        <ScrollView
          contentContainerStyle={{ padding: S.lg, paddingBottom: 130 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <InputBox label="Question Title *" placeholder="e.g. How does recursion work in Python?"
            value={title} onChangeText={v => { setTitle(v); setErrors(e => ({ ...e, title: "" })); }}
            maxLength={150} error={errors.title} {...f("title")} />
          <Text style={{ ...T.small, textAlign: "right", marginTop: -S.md, marginBottom: S.lg }}>{title.length}/150</Text>

          {/* Subject */}
          <Text style={{ ...T.label, marginBottom: S.sm }}>Subject *</Text>
          {errors.subject && <Text style={{ color: C.red, fontSize: 12, marginBottom: 6 }}>{errors.subject}</Text>}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: S.lg }}>
            {SUBJECTS.map(s => (
              <TouchableOpacity key={s}
                onPress={() => { setSubject(s); setErrors(e => ({ ...e, subject: "" })); }}
                style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: R.full, borderWidth: 1.5,
                  backgroundColor: subject === s ? C.accent : "transparent",
                  borderColor: subject === s ? C.accent : C.border }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: subject === s ? "#fff" : C.t3 }}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <InputBox label="Description *"
            placeholder={"Describe your problem in detail:\n• What have you tried?\n• What did you expect?\n• What happened?"}
            multiline style={{ minHeight: 140, textAlignVertical: "top" }}
            value={body} onChangeText={v => { setBody(v); setErrors(e => ({ ...e, body: "" })); }}
            error={errors.body} {...f("body")} />

          {/* Tags */}
          <Text style={{ ...T.label, marginBottom: S.sm }}>
            Tags <Text style={{ textTransform: "none", fontWeight: "400", letterSpacing: 0, color: C.t3 }}>(optional · up to 5)</Text>
          </Text>
          <View style={{ flexDirection: "row", backgroundColor: C.bg3, borderRadius: R.md,
            borderWidth: 1.5, borderColor: focused === "tag" ? C.accent : C.border,
            overflow: "hidden", marginBottom: S.sm }}>
            <InputBox
              placeholder="e.g. Recursion"
              value={tagInput} onChangeText={setTagInput}
              onSubmitEditing={addTag} returnKeyType="done"
              {...f("tag")}
              style={{ flex: 1, borderWidth: 0, marginBottom: 0, borderRadius: 0, backgroundColor: "transparent" }}
            />
            <TouchableOpacity onPress={addTag}
              style={{ backgroundColor: C.accent, paddingHorizontal: S.lg, justifyContent: "center" }}>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>+</Text>
            </TouchableOpacity>
          </View>

          {tags.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: S.lg }}>
              {tags.map(tag => (
                <TouchableOpacity key={tag} onPress={() => setTags(tags.filter(t => t !== tag))}
                  style={{ flexDirection: "row", alignItems: "center", backgroundColor: C.accentDim,
                    borderWidth: 1, borderColor: C.accent + "40", borderRadius: R.full,
                    paddingHorizontal: 12, paddingVertical: 5, gap: 5 }}
                >
                  <Text style={{ color: C.accentText, fontSize: 12, fontWeight: "600" }}>#{tag}</Text>
                  <Text style={{ color: C.accent, fontSize: 14, fontWeight: "800" }}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ gap: S.md, marginTop: S.lg }}>
            <PrimaryButton label="Post Question" onPress={submit} loading={loading} />
            <GhostButton label="Clear Form" onPress={reset} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
