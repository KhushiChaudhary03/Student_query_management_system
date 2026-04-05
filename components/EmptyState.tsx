import React from "react";
import { View, Text } from "react-native";
import { C, R, S, T } from "./theme";
import { PrimaryButton } from "./Atoms";

type Props = {
  emoji: string;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
};

export default function EmptyState({ emoji, title, body, action, onAction }: Props) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 64, paddingHorizontal: 40 }}>
      <View style={{ width: 68, height: 68, borderRadius: 34,
        backgroundColor: C.bg2, borderWidth: 1, borderColor: C.border,
        alignItems: "center", justifyContent: "center", marginBottom: S.xl }}>
        <Text style={{ fontSize: 30 }}>{emoji}</Text>
      </View>
      <Text style={{ ...T.h3, textAlign: "center", marginBottom: S.sm }}>{title}</Text>
      <Text style={{ ...T.body, textAlign: "center", marginBottom: S.xxl }}>{body}</Text>
      {action && onAction && (
        <View style={{ width: "100%" }}>
          <PrimaryButton label={action} onPress={onAction} />
        </View>
      )}
    </View>
  );
}
