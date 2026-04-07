import React, { useRef } from "react";
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";

type Props = {
  children: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | null;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  activeScale?: number;
};

export default function PressableScale({
  children,
  onPress,
  style,
  disabled,
  activeScale = 0.97,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 26,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress ?? undefined}
      onPressIn={() => animateTo(activeScale)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
