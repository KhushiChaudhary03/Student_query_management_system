import React, { useState } from "react";
import {
  View, Text, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { C, R, S, T } from "../../components/theme";
import InputBox from "../../components/InputBox";
import { PrimaryButton, ErrorBanner } from "../../components/Atoms";

export default function LoginScreen() {
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const submit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem("user");
      if (!raw) { setError("No account found. Please register first."); setLoading(false); return; }
      const u = JSON.parse(raw);
      if (u.email.toLowerCase() !== email.trim().toLowerCase()) { setError("Email not found. Please register."); setLoading(false); return; }
      if (u.password !== password) { setError("Incorrect password."); setLoading(false); return; }
      await AsyncStorage.setItem("userToken", "ok");
      router.replace("/(tabs)/home");
    } catch { setError("Something went wrong. Try again."); setLoading(false); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={{ paddingHorizontal: S.xxl, paddingTop: 56, paddingBottom: S.xxl }}>
            <View style={{ width: 46, height: 46, borderRadius: R.md, backgroundColor: C.accent,
              alignItems: "center", justifyContent: "center", marginBottom: S.xxl }}>
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>CQ</Text>
            </View>
            <Text style={{ ...T.h1, marginBottom: 6 }}>Welcome back</Text>
            <Text style={T.body}>Sign in to CampusQuery</Text>
          </View>

          <View style={{ paddingHorizontal: S.xxl }}>
            <InputBox label="College Email" placeholder="you@college.edu"
              keyboardType="email-address" autoCapitalize="none"
              value={email} onChangeText={setEmail}
              isFocused={focused === "email"}
              onFocus={() => setFocused("email")} onBlur={() => setFocused("")} />

            <InputBox label="Password" placeholder="Your password"
              secureTextEntry value={password} onChangeText={setPass}
              isFocused={focused === "pass"}
              onFocus={() => setFocused("pass")} onBlur={() => setFocused("")}
              onSubmitEditing={submit} />

            <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: -S.md, marginBottom: S.xl }}>
              <Text style={{ color: C.accent, fontSize: 13, fontWeight: "600" }}>Forgot password?</Text>
            </TouchableOpacity>

            <ErrorBanner message={error} />

            <PrimaryButton label="Sign In" onPress={submit} loading={loading} />

            <View style={{ height: 1, backgroundColor: C.border, marginVertical: S.xl }} />

            <View style={{ flexDirection: "row", justifyContent: "center", paddingBottom: S.xxxl }}>
              <Text style={T.body}>New student? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register" as any)}>
                <Text style={{ color: C.accent, fontWeight: "700", fontSize: 14 }}>Create account →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
