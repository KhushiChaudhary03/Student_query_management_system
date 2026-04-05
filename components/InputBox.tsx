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
        style={[{
          backgroundColor: C.bg3,
          color: C.t1,
          borderRadius: R.md,
          paddingHorizontal: S.lg,
          paddingVertical: 13,
          fontSize: 14,
          borderWidth: 1.5,
          borderColor: error ? C.red : isFocused ? C.accent : C.border,
        }, style]}
        placeholderTextColor={C.t3}
        {...rest}
      />
      {error ? <Text style={{ color: C.red, fontSize: 12, marginTop: 4 }}>{error}</Text> : null}
    </View>
  );
}
