import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { C, R, S, T } from "../../components/theme";
import InputBox from "../../components/InputBox";
import { PrimaryButton, ErrorBanner } from "../../components/Atoms";
import PressableScale from "../../components/PressableScale";
import { loginUser } from "../../firebase/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const submit = async () => {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }
    setLoading(true);
    try {
      await loginUser(email.trim(), password);
    } catch (e: any) {
      const code = e?.code ?? "";
      if (code === "auth/user-not-found" || code === "auth/invalid-email") {
        setError("No account found with this email. Please register.");
      } else if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Incorrect password. Please try again.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a moment and try again.");
      } else {
        setError("Sign in failed. Check your connection and try again.");
      }
      setLoading(false);
    }
  };

  const f = (id: string) => ({
    isFocused: focused === id,
    onFocus: () => setFocused(id),
    onBlur: () => setFocused(""),
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: S.xxxl }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: S.xxl, paddingTop: S.lg, paddingBottom: S.xxxl }}>
            <View style={{ position: "absolute", top: 22, right: -24, width: 124, height: 124, borderRadius: 62, backgroundColor: C.cyanDim }} />
            <View style={{ position: "absolute", top: 128, left: -30, width: 104, height: 104, borderRadius: 52, backgroundColor: C.roseDim }} />

            <View style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: S.md, marginBottom: S.xxl }}>
              <View style={{ width: 54, height: 54, borderRadius: 20, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 12 }, shadowRadius: 20, elevation: 8 }}>
                <Ionicons name="chatbubbles" size={24} color="#fff" />
              </View>
              <View>
                <Text style={{ color: C.t1, fontSize: 27, fontWeight: "900", letterSpacing: -0.6 }}>CampusQuery</Text>
                <Text style={{ color: C.t2, fontSize: 14, marginTop: 2 }}>Ask. Connect. Resolve.</Text>
              </View>
            </View>

            <View style={{ backgroundColor: C.bg2, borderRadius: 30, padding: S.xxl, borderWidth: 1, borderColor: C.border, shadowColor: "#020817", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 16 }, shadowRadius: 22, elevation: 10 }}>
              <View style={{ marginBottom: S.xl }}>
                <View style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 7, borderRadius: R.full, backgroundColor: C.sunDim, marginBottom: S.md }}>
                  <Ionicons name="sparkles" size={14} color={C.sun} />
                  <Text style={{ color: C.sun, fontSize: 12, fontWeight: "700" }}>Welcome back</Text>
                </View>
                <Text style={{ ...T.h1, fontSize: 30, marginBottom: 8 }}>Sign in to continue</Text>
                <Text style={{ ...T.body, fontSize: 15 }}>
                  Pick up your campus conversations, answers, and saved queries right where you left off.
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: S.sm, marginBottom: S.xl }}>
                {[
                  { icon: "flash", label: "Quick answers", tone: C.accentDim, color: C.accent },
                  { icon: "people", label: "Peer support", tone: C.cyanDim, color: C.cyan },
                  { icon: "shield-checkmark", label: "Trusted space", tone: C.greenDim, color: C.green },
                ].map((item) => (
                  <View key={item.label} style={{ flex: 1, backgroundColor: item.tone, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: item.color + "33" }}>
                    <Ionicons name={item.icon as any} size={16} color={item.color} />
                    <Text style={{ color: C.t1, fontSize: 12, fontWeight: "700", marginTop: 10 }}>{item.label}</Text>
                  </View>
                ))}
              </View>

              <View style={{ marginBottom: S.sm }}>
                <Text style={{ ...T.label, marginBottom: S.sm }}>Email</Text>
                <View style={{ position: "relative" }}>
                  <View style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}>
                    <Ionicons name="mail-outline" size={18} color={focused === "email" ? C.accent : C.t3} />
                  </View>
                  <InputBox placeholder="you@college.edu" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} style={{ paddingLeft: 44 }} {...f("email")} />
                </View>
              </View>

              <View>
                <Text style={{ ...T.label, marginBottom: S.sm }}>Password</Text>
                <View style={{ position: "relative" }}>
                  <View style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}>
                    <Ionicons name="lock-closed-outline" size={18} color={focused === "pass" ? C.accent : C.t3} />
                  </View>
                  <InputBox placeholder="Your password" secureTextEntry value={password} onChangeText={setPass} onSubmitEditing={submit} style={{ paddingLeft: 44 }} {...f("pass")} />
                </View>
              </View>

              <PressableScale style={{ alignSelf: "flex-end", marginTop: -S.sm, marginBottom: S.xl }} activeScale={0.96}>
                <Text style={{ color: C.accentText, fontSize: 13, fontWeight: "700" }}>Forgot password?</Text>
              </PressableScale>

              <ErrorBanner message={error} />

              <PrimaryButton label="Sign In" onPress={submit} loading={loading} />

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: S.sm, marginTop: S.xl }}>
                <Text style={T.body}>New to CampusQuery?</Text>
                <PressableScale onPress={() => router.push("/(auth)/register" as any)} activeScale={0.96}>
                  <Text style={{ color: C.cyan, fontWeight: "800", fontSize: 14 }}>Create account</Text>
                </PressableScale>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
