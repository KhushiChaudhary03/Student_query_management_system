import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { C,R,T } from "../../components/theme";
import Header from "../../components/Header";
import { Avatar, Divider } from "../../components/Atoms";
import EmptyState from "../../components/EmptyState";

type Notif = {
  id: string;
  type: "answer" | "vote" | "accepted" | "comment";
  message: string;
  questionTitle: string;
  questionId: string;
  author: string;
  time: string;
  read: boolean;
};

// Generates notifications from stored questions
const buildNotifs = (questions: any[]): Notif[] => {
  const notifs: Notif[] = [];
  questions.forEach(q => {
    if (q.answers > 0 && q.answersList?.length > 0) {
      q.answersList.forEach((a: any) => {
        notifs.push({
          id: `n_${a.id}`,
          type: a.isAccepted ? "accepted" : "answer",
          message: a.isAccepted
            ? `Your answer was accepted by the question author`
            : `${a.author} answered your question`,
          questionTitle: q.title,
          questionId: q.id,
          author: a.author,
          time: a.createdAt,
          read: false,
        });
      });
    }
    if (q.votes > 0) {
      notifs.push({
        id: `nv_${q.id}`,
        type: "vote",
        message: `Your question received ${q.votes} upvote${q.votes > 1 ? "s" : ""}`,
        questionTitle: q.title,
        questionId: q.id,
        author: "Community",
        time: q.createdAt,
        read: true,
      });
    }
  });
  return notifs;
};

const ICON: Record<string, string> = {
  answer:   "💬",
  vote:     "▲",
  accepted: "✓",
  comment:  "🗨️",
};

const ICON_BG: Record<string, string> = {
  answer:   C.accentDim,
  vote:     C.amberDim,
  accepted: C.greenDim,
  comment:  C.accentDim,
};

const ICON_COLOR: Record<string, string> = {
  answer:   C.accent,
  vote:     C.amber,
  accepted: C.green,
  comment:  C.accent,
};

// Static seed notifications shown to all users
const SEED_NOTIFS: Notif[] = [
  {
    id: "sn1", type: "answer", read: false, time: "3m ago",
    author: "Priya Mehta", questionId: "q1",
    message: "Priya Mehta answered your question",
    questionTitle: "How do I solve integration by parts in calculus?",
  },
  {
    id: "sn2", type: "accepted", read: false, time: "1h ago",
    author: "Rahul Sharma", questionId: "q5",
    message: "Your answer was accepted",
    questionTitle: "Process vs Thread — memory sharing and when to use each?",
  },
  {
    id: "sn3", type: "vote", read: true, time: "2h ago",
    author: "Community", questionId: "q3",
    message: "Your question received 10 upvotes",
    questionTitle: "Best roadmap for DSA preparation before placements?",
  },
  {
    id: "sn4", type: "answer", read: true, time: "5h ago",
    author: "Karan Singh", questionId: "q3",
    message: "Karan Singh answered your question",
    questionTitle: "Best roadmap for DSA preparation before placements?",
  },
  {
    id: "sn5", type: "vote", read: true, time: "1d ago",
    author: "Community", questionId: "q2",
    message: "Your question received 5 upvotes",
    questionTitle: "TCP vs UDP — when do you use each?",
  },
];

export default function NotificationsScreen() {
  const [notifs, setNotifs]   = useState<Notif[]>(SEED_NOTIFS);
  const [unread, setUnread]   = useState(SEED_NOTIFS.filter(n => !n.read).length);

  const load = useCallback(async () => {
    const q = await AsyncStorage.getItem("questions");
    if (q) {
      const userQ = JSON.parse(q);
      const generated = buildNotifs(userQ);
      // Merge user-generated notifs at the top
      setNotifs([...generated, ...SEED_NOTIFS]);
      setUnread(generated.filter(n => !n.read).length + SEED_NOTIFS.filter(n => !n.read).length);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  const handlePress = (notif: Notif) => {
    // Mark as read
    setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setUnread(prev => Math.max(0, prev - (notif.read ? 0 : 1)));
    // Navigate to question
    router.push(`/query/${notif.questionId}` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      <Header
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : "All caught up"}
        right={
          unread > 0 ? (
            <TouchableOpacity onPress={markAllRead}
              style={{ backgroundColor: C.accentDim, paddingHorizontal: 12, paddingVertical: 6,
                borderRadius: R.full, borderWidth: 1, borderColor: C.accent + "30" }}>
              <Text style={{ color: C.accentText, fontSize: 12, fontWeight: "700" }}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <FlatList
        data={notifs}
        keyExtractor={n => n.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: S.sm, paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: C.border, marginLeft: 70 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            activeOpacity={0.75}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              paddingHorizontal: S.lg,
              paddingVertical: S.md + 2,
              backgroundColor: item.read ? C.bg0 : C.accentDim + "60",
            }}
          >
            {/* Icon badge */}
            <View style={{
              width: 42, height: 42, borderRadius: 21,
              backgroundColor: ICON_BG[item.type],
              alignItems: "center", justifyContent: "center",
              marginRight: S.md, flexShrink: 0,
              borderWidth: 1, borderColor: ICON_COLOR[item.type] + "30",
            }}>
              <Text style={{ color: ICON_COLOR[item.type], fontSize: 16, fontWeight: "800" }}>
                {ICON[item.type]}
              </Text>
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
              <Text style={{ color: item.read ? C.t2 : C.t1, fontSize: 14,
                fontWeight: item.read ? "400" : "600", lineHeight: 20, marginBottom: 3 }}>
                {item.message}
              </Text>
              <Text style={{ color: C.t3, fontSize: 12, lineHeight: 17, marginBottom: 4 }} numberOfLines={1}>
                "{item.questionTitle}"
              </Text>
              <Text style={{ color: C.t3, fontSize: 11 }}>{item.time}</Text>
            </View>

            {/* Unread dot */}
            {!item.read && (
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent,
                marginTop: 6, marginLeft: S.sm, flexShrink: 0 }} />
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🔔"
            title="No notifications yet"
            body="When someone answers or votes on your questions, you'll see it here."
          />
        }
      />
    </View>
  );
}

const S = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };
