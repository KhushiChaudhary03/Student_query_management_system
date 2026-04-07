import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { C, R, S } from "./theme";
import PressableScale from "./PressableScale";

const AVATAR_SWATCHES = [
  { bg: "#1D4ED8", fg: "#DBEAFE", ring: "#60A5FA55" },
  { bg: "#BE185D", fg: "#FFE4E6", ring: "#FDA4AF55" },
  { bg: "#0F766E", fg: "#CCFBF1", ring: "#5EEAD455" },
  { bg: "#7C3AED", fg: "#EDE9FE", ring: "#C4B5FD55" },
  { bg: "#C2410C", fg: "#FFEDD5", ring: "#FDBA7455" },
  { bg: "#15803D", fg: "#DCFCE7", ring: "#86EFAC55" },
];

export function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const safeName = name?.trim() || "User";
  const letters = safeName.split(" ").map(w => w[0] ?? "").join("").toUpperCase().slice(0, 2);
  const seed = safeName.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const swatch = AVATAR_SWATCHES[seed % AVATAR_SWATCHES.length];

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: swatch.bg,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: swatch.ring,
        shadowColor: swatch.bg,
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 4,
      }}
    >
      <Text style={{ color: swatch.fg, fontSize: size * 0.36, fontWeight: "800" }}>{letters}</Text>
    </View>
  );
}

export function SubjectPill({ subject }: { subject: string }) {
  const [bg, fg] = C.subjects[subject] ?? ["#1F2937", "#9CA3AF"];
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: R.full, borderWidth: 1, borderColor: fg + "22" }}>
      <Text style={{ color: fg, fontSize: 11, fontWeight: "700" }}>{subject}</Text>
    </View>
  );
}

export function Tag({ label }: { label: string }) {
  return (
    <View style={{ backgroundColor: C.bgSoft, paddingHorizontal: 9, paddingVertical: 4, borderRadius: R.xs, borderWidth: 1, borderColor: C.border }}>
      <Text style={{ color: C.accentText, fontSize: 11, fontWeight: "600" }}>#{label}</Text>
    </View>
  );
}

export function VoteButton({ count, voted, onPress }: { count: number; voted: boolean; onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      activeScale={0.92}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: voted ? C.roseDim : C.bgSoft,
        paddingHorizontal: 11,
        paddingVertical: 6,
        borderRadius: R.sm,
        borderWidth: 1,
        borderColor: voted ? C.rose + "60" : C.border,
      }}
    >
      <Text style={{ color: voted ? C.rose : C.t2, fontSize: 13 }}>{"\u25B2"}</Text>
      <Text style={{ color: voted ? C.rose : C.t2, fontSize: 13, fontWeight: "700" }}>{count}</Text>
    </PressableScale>
  );
}

export function PrimaryButton({ label, onPress, loading, disabled }: { label: string; onPress: () => void; loading?: boolean; disabled?: boolean }) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={loading || disabled}
      activeScale={0.97}
      style={{
        backgroundColor: (loading || disabled) ? C.accent + "70" : C.accent,
        borderRadius: R.md,
        paddingVertical: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: C.accent + "55",
        shadowColor: C.accent,
        shadowOpacity: loading || disabled ? 0 : 0.24,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 18,
        elevation: 5,
      }}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>{label}</Text>}
    </PressableScale>
  );
}

export function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      activeScale={0.98}
      style={{
        borderWidth: 1.5,
        borderColor: C.borderLight,
        backgroundColor: C.bgSoft,
        borderRadius: R.md,
        paddingVertical: 12,
        alignItems: "center",
      }}
    >
      <Text style={{ color: C.accentText, fontWeight: "600", fontSize: 14 }}>{label}</Text>
    </PressableScale>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: C.border }} />;
}

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <View style={{ backgroundColor: C.redDim, borderRadius: R.sm, padding: S.md, marginBottom: S.lg, borderWidth: 1, borderColor: C.red + "30", flexDirection: "row", gap: S.sm, alignItems: "flex-start" }}>
      <Text style={{ color: C.red, fontSize: 14 }}>{"\u26A0"}</Text>
      <Text style={{ color: C.red, fontSize: 13, flex: 1 }}>{message}</Text>
    </View>
  );
}

export function StatusBadge({ answered }: { answered: boolean }) {
  return (
    <View style={{ paddingHorizontal: 9, paddingVertical: 3, borderRadius: R.full, backgroundColor: answered ? C.greenDim : C.sunDim, borderWidth: 1, borderColor: (answered ? C.green : C.sun) + "30" }}>
      <Text style={{ color: answered ? C.green : C.sun, fontSize: 11, fontWeight: "700" }}>
        {answered ? `${"\u2713"} Answered` : "Pending"}
      </Text>
    </View>
  );
}
