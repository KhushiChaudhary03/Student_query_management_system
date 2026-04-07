import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { C, R, S, T } from "./theme";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  isFocused?: boolean;
};

export default function InputBox({ label, error, isFocused, style, ...rest }: Props) {
  return (
    <View style={{ marginBottom: S.lg }}>
      {label && <Text style={{ ...T.label, marginBottom: S.sm }}>{label}</Text>}
      <TextInput
        style={[
          {
            backgroundColor: C.bgSoft,
            color: C.t1,
            borderRadius: R.md,
            paddingHorizontal: S.lg,
            paddingVertical: 13,
            fontSize: 14,
            borderWidth: 1.5,
            borderColor: error ? C.red : isFocused ? C.accent : C.border,
            shadowColor: "#020817",
            shadowOpacity: isFocused ? 0.28 : 0.16,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 18,
            elevation: isFocused ? 6 : 2,
          },
          style,
        ]}
        placeholderTextColor={C.t3}
        {...rest}
      />
      {error ? <Text style={{ color: C.red, fontSize: 12, marginTop: 4 }}>{error}</Text> : null}
    </View>
  );
}
