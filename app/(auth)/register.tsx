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
import { registerUser, sendVerificationEmailToUser } from "../../firebase/auth";

const DEPTS = [
  "Computer Science", "Information Technology", "Electronics",
  "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
  "Mathematics", "Physics", "Chemistry", "Commerce", "Economics", "Management",
];

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [dept, setDept] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showDept, setShowDept] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const f = (id: string) => ({
    isFocused: focused === id,
    onFocus: () => setFocused(id),
    onBlur: () => setFocused(""),
  });

  const validate = () => {
    if (!name.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return false;
    }
    if (!college.trim()) {
      setError("Please enter your college name.");
      return false;
    }
    if (!dept) {
      setError("Please select your department.");
      return false;
    }
    if (pass.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (pass !== confirm) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const submit = async () => {
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await registerUser(email.trim(), pass, name.trim(), college.trim(), dept);
      await sendVerificationEmailToUser(user);
      setLoading(false);
      router.replace("/(auth)/verify-email");
    } catch (e: any) {
      const code = e?.code ?? "";
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Please sign in.");
      } else if (code === "auth/invalid-email") {
        setError("The email address is invalid.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Use at least 8 characters.");
      } else {
        setError("Registration failed. Check your connection and try again.");
      }
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={20}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
          <View style={{ paddingHorizontal: S.xxl, paddingTop: S.lg }}>
            <View style={{ position: "absolute", top: 30, left: -28, width: 112, height: 112, borderRadius: 56, backgroundColor: C.sunDim }} />
            <View style={{ position: "absolute", top: 180, right: -34, width: 128, height: 128, borderRadius: 64, backgroundColor: C.cyanDim }} />

            <PressableScale onPress={() => router.back()} activeScale={0.97} style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.bg2, paddingHorizontal: 14, paddingVertical: 10, borderRadius: R.full, borderWidth: 1, borderColor: C.border, marginBottom: S.xl }}>
              <Ionicons name="arrow-back" size={16} color={C.t1} />
              <Text style={{ color: C.t1, fontWeight: "700", fontSize: 13 }}>Back</Text>
            </PressableScale>

            <View style={{ flexDirection: "row", alignItems: "center", gap: S.md, marginBottom: S.xl }}>
              <View style={{ width: 56, height: 56, borderRadius: 20, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 12 }, shadowRadius: 20, elevation: 8 }}>
                <Ionicons name="school" size={25} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.t1, fontSize: 27, fontWeight: "900", letterSpacing: -0.6 }}>Join CampusQuery</Text>
                <Text style={{ color: C.t2, fontSize: 14, marginTop: 2 }}>Ask. Connect. Resolve.</Text>
              </View>
            </View>

            <View style={{ backgroundColor: C.bg2, borderRadius: 30, padding: S.xxl, borderWidth: 1, borderColor: C.border, shadowColor: "#020817", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 16 }, shadowRadius: 22, elevation: 10 }}>
              <View style={{ marginBottom: S.lg }}>
                <View style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 7, borderRadius: R.full, backgroundColor: C.roseDim, marginBottom: S.md }}>
                  <Ionicons name="planet" size={14} color={C.rose} />
                  <Text style={{ color: C.rose, fontSize: 12, fontWeight: "700" }}>Student community</Text>
                </View>
                <Text style={{ ...T.h1, fontSize: 30, marginBottom: 8 }}>Create your account</Text>
                <Text style={{ ...T.body, fontSize: 15 }}>
                  Build your profile once and start asking questions, finding answers, and helping others on campus.
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: S.sm, marginBottom: S.xl }}>
                {[
                  { icon: "help-circle", label: "Ask freely", tone: C.accentDim, color: C.accent },
                  { icon: "notifications", label: "Get updates", tone: C.sunDim, color: C.sun },
                  { icon: "ribbon", label: "Build trust", tone: C.greenDim, color: C.green },
                ].map((item) => (
                  <View key={item.label} style={{ flex: 1, backgroundColor: item.tone, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: item.color + "33" }}>
                    <Ionicons name={item.icon as any} size={16} color={item.color} />
                    <Text style={{ color: C.t1, fontSize: 12, fontWeight: "700", marginTop: 10 }}>{item.label}</Text>
                  </View>
                ))}
              </View>

              <Text style={{ ...T.label, marginBottom: S.sm }}>Full Name</Text>
              <View style={{ position: "relative" }}>
                <View style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}>
                  <Ionicons name="person-outline" size={18} color={focused === "name" ? C.accent : C.t3} />
                </View>
                <InputBox placeholder="e.g. Priya Sharma" autoCapitalize="words" value={name} onChangeText={setName} style={{ paddingLeft: 44 }} {...f("name")} />
              </View>

              <Text style={{ ...T.label, marginBottom: S.sm }}>Email</Text>
              <View style={{ position: "relative" }}>
                <View style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}>
                  <Ionicons name="mail-outline" size={18} color={focused === "email" ? C.accent : C.t3} />
                </View>
                <InputBox placeholder="you@college.edu" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} style={{ paddingLeft: 44 }} {...f("email")} />
              </View>

              <Text style={{ ...T.label, marginBottom: S.sm }}>College / University</Text>
              <View style={{ position: "relative" }}>
                <View style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}>
                  <Ionicons name="business-outline" size={18} color={focused === "college" ? C.accent : C.t3} />
                </View>
                <InputBox placeholder="e.g. Delhi University" autoCapitalize="words" value={college} onChangeText={setCollege} style={{ paddingLeft: 44 }} {...f("college")} />
              </View>

              <Text style={{ ...T.label, marginBottom: S.sm }}>Department</Text>
              <PressableScale onPress={() => setShowDept((p) => !p)} activeScale={0.98} style={{ backgroundColor: C.bgSoft, borderRadius: 16, paddingHorizontal: S.lg, paddingVertical: 15, borderWidth: 1.5, borderColor: dept ? C.accent : C.border, marginBottom: showDept ? 6 : S.lg, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Ionicons name="grid-outline" size={18} color={dept ? C.accent : C.t3} />
                  <Text style={{ color: dept ? C.t1 : C.t3, fontSize: 14, fontWeight: dept ? "600" : "400" }}>{dept || "Select department"}</Text>
                </View>
                <Ionicons name={showDept ? "chevron-up" : "chevron-down"} size={18} color={C.t2} />
              </PressableScale>
              {showDept && (
                <View style={{ backgroundColor: C.bgSoft, borderRadius: 18, borderWidth: 1, borderColor: C.border, marginBottom: S.lg, overflow: "hidden" }}>
                  {DEPTS.map((d, i) => (
                    <PressableScale key={d} onPress={() => { setDept(d); setShowDept(false); }} style={{ paddingHorizontal: S.lg, paddingVertical: 14, borderBottomWidth: i < DEPTS.length - 1 ? 1 : 0, borderBottomColor: C.border, backgroundColor: dept === d ? C.accentDim : "transparent", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text style={{ color: dept === d ? C.accentText : C.t2, fontSize: 14, fontWeight: dept === d ? "700" : "500" }}>{d}</Text>
                      {dept === d ? <Ionicons name="checkmark-circle" size={18} color={C.accent} /> : null}
                    </PressableScale>
                  ))}
                </View>
              )}

              <Text style={{ ...T.label, marginBottom: S.sm }}>Password</Text>
              <View style={{ position: "relative" }}>
                <View style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}>
                  <Ionicons name="lock-closed-outline" size={18} color={focused === "pass" ? C.accent : C.t3} />
                </View>
                <InputBox placeholder="Min 8 characters" secureTextEntry value={pass} onChangeText={setPass} style={{ paddingLeft: 44 }} {...f("pass")} />
              </View>

              <Text style={{ ...T.label, marginBottom: S.sm }}>Confirm Password</Text>
              <View style={{ position: "relative" }}>
                <View style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={focused === "confirm" ? C.accent : C.t3} />
                </View>
                <InputBox placeholder="Re-enter password" secureTextEntry value={confirm} onChangeText={setConfirm} onSubmitEditing={submit} style={{ paddingLeft: 44 }} {...f("confirm")} />
              </View>

              <Text style={{ color: C.t3, fontSize: 12, textAlign: "center", lineHeight: 18, marginBottom: S.xl }}>
                By registering you agree to our <Text style={{ color: C.accentText }}>Terms</Text> and <Text style={{ color: C.accentText }}>Privacy Policy</Text>.
              </Text>

              <ErrorBanner message={error} />

              <PrimaryButton label="Create Account" onPress={submit} loading={loading} />

              <View style={{ flexDirection: "row", justifyContent: "center", marginTop: S.xl, paddingBottom: S.xs, gap: 6 }}>
                <Text style={T.body}>Already have an account?</Text>
                <PressableScale onPress={() => router.push("/(auth)/login" as any)} activeScale={0.96}>
                  <Text style={{ color: C.cyan, fontWeight: "800", fontSize: 14 }}>Sign in</Text>
                </PressableScale>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
