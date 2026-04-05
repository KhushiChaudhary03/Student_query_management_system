import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { C, S, T } from "./theme";

type Props = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export default function Header({ title, subtitle, left, right }: Props) {
  return (
    <View style={{
      backgroundColor: C.bg1,
      paddingHorizontal: S.lg,
      paddingTop: 50,
      paddingBottom: S.lg,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
      flexDirection: "row",
      alignItems: "center",
      gap: S.md,
    }}>
      {left}
      <View style={{ flex: 1 }}>
        <Text style={T.h2}>{title}</Text>
        {subtitle && <Text style={T.small}>{subtitle}</Text>}
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
          style={{ width: 36, height: 36, borderRadius: 18,
            backgroundColor: C.bg2, borderWidth: 1, borderColor: C.border,
            alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: C.accent, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
      }
    />
  );
}
