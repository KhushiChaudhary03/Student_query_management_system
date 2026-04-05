import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { C, R, S, T } from "./theme";

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const letters = name.split(" ").map(w => w[0] ?? "").join("").toUpperCase().slice(0, 2);
  // Pick a stable hue from name
  const hue = (name.charCodeAt(0) * 37 + (name.charCodeAt(1) ?? 0) * 13) % 360;
  const bg  = `hsl(${hue},55%,28%)`;
  const fg  = `hsl(${hue},80%,80%)`;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: fg, fontSize: size * 0.36, fontWeight: "700" }}>{letters}</Text>
    </View>
  );
}

// ── SubjectPill ───────────────────────────────────────────────────────────────
export function SubjectPill({ subject }: { subject: string }) {
  const [bg, fg] = C.subjects[subject] ?? ["#1F2937", "#9CA3AF"];
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 9, paddingVertical: 3, borderRadius: R.full }}>
      <Text style={{ color: fg, fontSize: 11, fontWeight: "700" }}>{subject}</Text>
    </View>
  );
}

// ── Tag ───────────────────────────────────────────────────────────────────────
export function Tag({ label }: { label: string }) {
  return (
    <View style={{ backgroundColor: C.bg3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.xs }}>
      <Text style={{ color: C.t3, fontSize: 11 }}>#{label}</Text>
    </View>
  );
}

// ── VoteButton ────────────────────────────────────────────────────────────────
export function VoteButton({ count, voted, onPress }: { count: number; voted: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", gap: 5,
        backgroundColor: voted ? C.accentDim : C.bg3,
        paddingHorizontal: 11, paddingVertical: 6, borderRadius: R.sm,
        borderWidth: 1, borderColor: voted ? C.accent + "60" : C.border }}
    >
      <Text style={{ color: voted ? C.accent : C.t2, fontSize: 13 }}>▲</Text>
      <Text style={{ color: voted ? C.accent : C.t2, fontSize: 13, fontWeight: "700" }}>{count}</Text>
    </TouchableOpacity>
  );
}

// ── PrimaryButton ─────────────────────────────────────────────────────────────
export function PrimaryButton({ label, onPress, loading, disabled }: { label: string; onPress: () => void; loading?: boolean; disabled?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress} disabled={loading || disabled} activeOpacity={0.82}
      style={{ backgroundColor: (loading || disabled) ? C.accent + "70" : C.accent, borderRadius: R.md, paddingVertical: 14, alignItems: "center" }}
    >
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

// ── GhostButton ───────────────────────────────────────────────────────────────
export function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}
      style={{ borderWidth: 1.5, borderColor: C.border, borderRadius: R.md, paddingVertical: 12, alignItems: "center" }}
    >
      <Text style={{ color: C.t2, fontWeight: "600", fontSize: 14 }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider() {
  return <View style={{ height: 1, backgroundColor: C.border }} />;
}

// ── ErrorBanner ───────────────────────────────────────────────────────────────
export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <View style={{ backgroundColor: C.redDim, borderRadius: R.sm, padding: S.md, marginBottom: S.lg, borderWidth: 1, borderColor: C.red + "30", flexDirection: "row", gap: S.sm, alignItems: "flex-start" }}>
      <Text style={{ color: C.red, fontSize: 14 }}>⚠️</Text>
      <Text style={{ color: C.red, fontSize: 13, flex: 1 }}>{message}</Text>
    </View>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
export function StatusBadge({ answered }: { answered: boolean }) {
  return (
    <View style={{ paddingHorizontal: 9, paddingVertical: 3, borderRadius: R.full,
      backgroundColor: answered ? C.greenDim : C.amberDim,
      borderWidth: 1, borderColor: (answered ? C.green : C.amber) + "30" }}
    >
      <Text style={{ color: answered ? C.green : C.amber, fontSize: 11, fontWeight: "700" }}>
        {answered ? "✓ Answered" : "⏳ Pending"}
      </Text>
    </View>
  );
}
