import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { C, S, T } from "./theme";

type Props = {
  title?: string;
  subtitle?: string;
  compact?: boolean;
};

export default function BrandedLoader({
  title = "Loading CampusQuery",
  subtitle = "Bringing your campus conversations into view.",
  compact,
}: Props) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: S.xxl }}>
      <View
        style={{
          width: compact ? 88 : 108,
          height: compact ? 88 : 108,
          borderRadius: compact ? 28 : 34,
          backgroundColor: C.bg2,
          borderWidth: 1,
          borderColor: C.border,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: S.xl,
          shadowColor: "#020817",
          shadowOpacity: 0.24,
          shadowOffset: { width: 0, height: 14 },
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: compact ? 54 : 62,
            height: compact ? 54 : 62,
            borderRadius: 999,
            backgroundColor: C.cyanDim,
          }}
        />
        <View
          style={{
            width: compact ? 44 : 52,
            height: compact ? 44 : 52,
            borderRadius: 18,
            backgroundColor: C.accent,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: C.accent,
            shadowOpacity: 0.35,
            shadowOffset: { width: 0, height: 10 },
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <Ionicons name="chatbubbles" size={compact ? 20 : 24} color="#fff" />
        </View>
      </View>

      <ActivityIndicator color={C.sun} size="small" style={{ marginBottom: S.md }} />
      <Text style={{ ...T.h2, fontSize: compact ? 18 : 20, marginBottom: 6 }}>{title}</Text>
      <Text style={{ ...T.body, textAlign: "center", maxWidth: 280 }}>{subtitle}</Text>
    </View>
  );
}

