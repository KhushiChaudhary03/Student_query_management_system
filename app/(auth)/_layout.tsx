import { Stack, router, useSegments } from "expo-router";
import { useEffect } from "react";
import { onAuthChange, reloadAuthUser } from "../../firebase/auth";

export default function AuthLayout() {
  const segments = useSegments();

  useEffect(() => {
    const unsub = onAuthChange(async user => {
      if (!user) return;
      const refreshed = await reloadAuthUser(user);
      if (!refreshed) return;

      const currentLeaf = segments[segments.length - 1];
      if (refreshed.emailVerified) {
        router.replace("/(tabs)/home");
      } else if (currentLeaf !== "verify-email") {
        router.replace("/(auth)/verify-email");
      }
    });

    return unsub;
  }, [segments]);

  return <Stack screenOptions={{ headerShown: false, animation: "fade" }} />;
}
