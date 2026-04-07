import React, { useEffect, useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { C, R, S, T } from "../../components/theme";
import { PrimaryButton, GhostButton } from "../../components/Atoms";
import PressableScale from "../../components/PressableScale";
import {
  currentUser,
  logoutUser,
  reloadAuthUser,
  sendVerificationEmailToUser,
} from "../../firebase/auth";

export default function VerifyEmailScreen() {
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("A verification link has been sent to your email address.");
  const [messageTone, setMessageTone] = useState<"info" | "success" | "error">("info");

  useEffect(() => {
    const user = currentUser();
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }
    setMessage(`We sent a verification link to ${user.email ?? "your email"}.`);
  }, []);

  const handleVerified = async () => {
    setChecking(true);
    try {
      const refreshed = await reloadAuthUser();
      if (refreshed?.emailVerified) {
        setMessageTone("success");
        setMessage("Email verified successfully. Redirecting you now.");
        router.replace("/(tabs)/home");
      } else {
        setMessageTone("error");
        setMessage("Your email is not verified yet. Open the link from your inbox and then try again.");
      }
    } catch {
      setMessageTone("error");
      setMessage("We could not refresh your account right now. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await sendVerificationEmailToUser();
      setMessageTone("success");
      setMessage("Verification email sent again. Please check your inbox and spam folder.");
    } catch {
      setMessageTone("error");
      setMessage("We could not resend the email right now. Please wait a moment and try again.");
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/(auth)/login");
  };

  const bannerBg = messageTone === "success" ? C.greenDim : messageTone === "error" ? C.redDim : C.cyanDim;
  const bannerColor = messageTone === "success" ? C.green : messageTone === "error" ? C.red : C.cyan;
  const bannerIcon = messageTone === "success" ? "checkmark-circle" : messageTone === "error" ? "alert-circle" : "mail-open-outline";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: S.xxxl }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: S.xxl, paddingTop: S.lg, paddingBottom: S.xxxl }}>
            <View style={{ position: "absolute", top: 24, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: C.cyanDim }} />
            <View style={{ position: "absolute", top: 132, left: -26, width: 108, height: 108, borderRadius: 54, backgroundColor: C.sunDim }} />

            <PressableScale
              onPress={handleLogout}
              activeScale={0.97}
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: C.bg2,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: R.full,
                borderWidth: 1,
                borderColor: C.border,
                marginBottom: S.xl,
              }}
            >
              <Ionicons name="log-out-outline" size={16} color={C.t1} />
              <Text style={{ color: C.t1, fontWeight: "700", fontSize: 13 }}>Back to sign in</Text>
            </PressableScale>

            <View style={{ flexDirection: "row", alignItems: "center", gap: S.md, marginBottom: S.xl }}>
              <View style={{ width: 56, height: 56, borderRadius: 20, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 12 }, shadowRadius: 20, elevation: 8 }}>
                <Ionicons name="mail-open" size={25} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.t1, fontSize: 27, fontWeight: "900", letterSpacing: -0.6 }}>Verify your email</Text>
                <Text style={{ color: C.t2, fontSize: 14, marginTop: 2 }}>One quick step before entering CampusQuery</Text>
              </View>
            </View>

            <View style={{ backgroundColor: C.bg2, borderRadius: 30, padding: S.xxl, borderWidth: 1, borderColor: C.border, shadowColor: "#020817", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 16 }, shadowRadius: 22, elevation: 10 }}>
              <View style={{ alignItems: "center", marginBottom: S.xl }}>
                <View style={{ width: 86, height: 86, borderRadius: 28, backgroundColor: C.accentDim, borderWidth: 1, borderColor: C.accent + "35", alignItems: "center", justifyContent: "center", marginBottom: S.lg }}>
                  <Ionicons name="mail-unread-outline" size={38} color={C.accentText} />
                </View>
                <Text style={{ ...T.h1, fontSize: 28, textAlign: "center", marginBottom: 8 }}>Check your inbox</Text>
                <Text style={{ ...T.body, fontSize: 15, textAlign: "center" }}>
                  We sent you a verification link. Open it from your email app, then come back here once you are done.
                </Text>
              </View>

              <View style={{ backgroundColor: bannerBg, borderRadius: 18, borderWidth: 1, borderColor: bannerColor + "35", padding: S.lg, marginBottom: S.xl, flexDirection: "row", gap: S.sm, alignItems: "flex-start" }}>
                <Ionicons name={bannerIcon as any} size={18} color={bannerColor} style={{ marginTop: 1 }} />
                <Text style={{ color: bannerColor, fontSize: 13, lineHeight: 20, flex: 1 }}>{message}</Text>
              </View>

              <View style={{ backgroundColor: C.bgSoft, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: S.lg, marginBottom: S.xl }}>
                <Text style={{ ...T.label, color: C.accentText, marginBottom: 8 }}>Tips</Text>
                <Text style={{ ...T.small, color: C.t2, lineHeight: 19 }}>Open the newest verification email, tap the confirmation link, and if you do not see it, check your spam folder.</Text>
              </View>

              <View style={{ gap: S.md }}>
                <PrimaryButton label="I've verified" onPress={handleVerified} loading={checking} />
                <GhostButton label={resending ? "Sending..." : "Resend Email"} onPress={handleResend} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
