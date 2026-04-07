import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { C, R, S } from "../../components/theme";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import BrandedLoader from "../../components/BrandedLoader";
import { Notification } from "../../components/types";
import {
  subscribeToNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../firebase/notifications";
import { AppSettings, DEFAULT_SETTINGS, subscribeToAppSettings } from "../../store/settings";

const ICON: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
  answer: "chatbubble-ellipses",
  vote: "arrow-up",
  accepted: "checkmark-circle",
};
const IBGC: Record<string, string> = { answer: C.cyanDim, vote: C.sunDim, accepted: C.accentAltDim };
const ICLR: Record<string, string> = { answer: C.cyan, vote: C.sun, accepted: C.accentAlt };

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useFocusEffect(
    useCallback(() => {
      const unsub = subscribeToNotifications(data => {
        setNotifs(data);
        setLoading(false);
      });
      return unsub;
    }, []),
  );

  useEffect(() => subscribeToAppSettings(setSettings), []);

  const unread = notifs.filter(n => !n.read).length;

  const handlePress = async (n: Notification) => {
    if (!n.read) await markNotificationRead(n.id);
    setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    router.push(`/query/${n.questionId}` as any);
  };

  const markAll = async () => {
    const ids = notifs.filter(n => !n.read).map(n => n.id);
    if (ids.length === 0) return;
    await markAllNotificationsRead(ids);
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg0 }}>
        <Header title="Notifications" />
        <BrandedLoader title="Loading notifications" subtitle="Checking for replies, votes, and accepted answers." compact />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      <Header
        title="Notifications"
        subtitle={settings.pushEnabled ? (unread > 0 ? `${unread} unread` : "All caught up") : "Push alerts are muted"}
        right={
          settings.pushEnabled && unread > 0 ? (
            <TouchableOpacity
              onPress={markAll}
              style={{ backgroundColor: C.accentDim, paddingHorizontal: 12, paddingVertical: 6, borderRadius: R.full, borderWidth: 1, borderColor: C.accent + "30" }}
            >
              <Text style={{ color: C.accentText, fontSize: 12, fontWeight: "700" }}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <FlatList
        data={notifs}
        keyExtractor={n => n.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: settings.compactMode ? S.xs : S.sm, paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: C.border, marginLeft: 70 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            activeOpacity={0.75}
            style={{ flexDirection: "row", alignItems: "flex-start", paddingHorizontal: S.lg, paddingVertical: settings.compactMode ? S.md : S.md + 2, backgroundColor: item.read ? C.bg0 : C.accentDim + "50" }}
          >
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: IBGC[item.type] ?? C.accentDim, alignItems: "center", justifyContent: "center", marginRight: S.md, flexShrink: 0, borderWidth: 1, borderColor: (ICLR[item.type] ?? C.accent) + "30" }}>
              <Ionicons name={ICON[item.type] ?? "notifications"} size={16} color={ICLR[item.type] ?? C.accent} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: item.read ? C.t2 : C.t1, fontSize: 14, fontWeight: item.read ? "400" : "600", lineHeight: 20, marginBottom: 3 }}>
                {item.message}
              </Text>
              <Text style={{ color: C.t3, fontSize: 12, lineHeight: 17, marginBottom: 4 }} numberOfLines={1}>
                &quot;{item.questionTitle}&quot;
              </Text>
              <Text style={{ color: C.t3, fontSize: 11 }}>{String(item.createdAt ?? "Just now")}</Text>
            </View>

            {!item.read && settings.pushEnabled && (
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.rose, marginTop: 6, marginLeft: S.sm, flexShrink: 0 }} />
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<EmptyState icon="notifications-off-outline" iconColor={C.cyan} iconBg={C.cyanDim} title="No notifications yet" body="When someone answers or votes on your questions, you'll see it here." />}
      />
    </View>
  );
}

