import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { C, S, T } from "./theme";
import { PrimaryButton } from "./Atoms";

type Props = {
  emoji?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
  iconBg?: string;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
};

export default function EmptyState({
  emoji,
  icon = "sparkles-outline",
  iconColor = C.cyan,
  iconBg = C.bg2,
  title,
  body,
  action,
  onAction,
}: Props) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 72, paddingHorizontal: 32 }}>
      <View style={{
        width: 92,
        height: 92,
        borderRadius: 46,
        backgroundColor: iconBg,
        borderWidth: 1,
        borderColor: C.borderLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: S.xl,
        shadowColor: "#020817",
        shadowOpacity: 0.22,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 18,
        elevation: 4,
      }}>
        <View style={{
          position: "absolute",
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: iconColor + "18",
        }} />
        {emoji ? (
          <Text style={{ fontSize: 30 }}>{emoji}</Text>
        ) : (
          <Ionicons name={icon} size={34} color={iconColor} />
        )}
      </View>
      <Text style={{ ...T.h3, fontSize: 18, textAlign: "center", marginBottom: S.sm }}>{title}</Text>
      <Text style={{ ...T.body, textAlign: "center", marginBottom: S.xxl, maxWidth: 280 }}>{body}</Text>
      {action && onAction && (
        <View style={{ width: "100%", maxWidth: 240 }}>
          <PrimaryButton label={action} onPress={onAction} />
        </View>
      )}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: S.lg }}>
        <Ionicons name="sparkles" size={14} color={C.sun} />
        <Text style={{ ...T.small, color: C.t2 }}>Your next useful thread starts here.</Text>
      </View>
    </View>
  );
}
