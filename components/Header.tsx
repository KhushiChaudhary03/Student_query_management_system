import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { C, S, T } from "./theme";
import { AppSettings, DEFAULT_SETTINGS, subscribeToAppSettings } from "../store/settings";

type Props = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export default function Header({ title, subtitle, left, right }: Props) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => subscribeToAppSettings(setSettings), []);

  return (
    <View style={{
      backgroundColor: C.bg1,
      paddingHorizontal: S.lg,
      paddingTop: 50,
      paddingBottom: settings.compactMode ? S.md : S.lg,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
      flexDirection: "row",
      alignItems: "center",
      gap: settings.compactMode ? S.sm : S.md,
    }}>
      {left}
      <View style={{ flex: 1 }}>
        <Text style={T.h2}>{title}</Text>
        {subtitle && <Text style={{ ...T.small, color: C.t2, marginTop: 2 }}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}

export function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <Header
      title={title}
      left={
        <TouchableOpacity
          onPress={onBack}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: C.bg2,
            borderWidth: 1,
            borderColor: C.borderLight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={18} color={C.accentText} />
        </TouchableOpacity>
      }
    />
  );
}
