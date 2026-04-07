import React, { useEffect, useRef } from "react";
import { Animated, View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { C, R, S, T } from "./theme";
import { Question } from "./types";
import { Avatar, SubjectPill, Tag, VoteButton, Divider } from "./Atoms";
import PressableScale from "./PressableScale";

type Props = {
  question: Question;
  voted: boolean;
  saved?: boolean;
  onPress: () => void;
  onVote: () => void;
  onToggleSave?: () => void;
  compact?: boolean;
};

export default function QuestionCard({ question, voted, saved, onPress, onVote, onToggleSave, compact }: Props) {
  const topAnswer = question.answersList?.[0] ?? null;
  const hasAccepted = question.answersList?.some(a => a.isAccepted);
  const authorLabel = question.authorName || question.author || "Anonymous";
  const topAnswerAuthor = topAnswer?.authorName || topAnswer?.author || "Anonymous";
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise]);

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }] }}>
      <PressableScale
        onPress={onPress}
        activeScale={0.985}
        style={{
          backgroundColor: C.bg2,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: saved ? C.sun + "55" : C.border,
          marginBottom: compact ? S.md : S.lg,
          overflow: "hidden",
          shadowColor: "#020817",
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: 12 },
          shadowRadius: 20,
          elevation: 5,
        }}
      >
        {hasAccepted && <View style={{ height: 3, backgroundColor: C.green }} />}

        <View style={{ padding: compact ? S.md : S.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.sm }}>
            <SubjectPill subject={question.subject} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {onToggleSave ? (
                <TouchableOpacity
                  onPress={e => {
                    e.stopPropagation();
                    onToggleSave();
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: saved ? C.sunDim : C.bgSoft,
                    borderWidth: 1,
                    borderColor: saved ? C.sun + "35" : C.border,
                  }}
                >
                  <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={15} color={saved ? C.sun : C.t3} />
                </TouchableOpacity>
              ) : null}
              {hasAccepted && (
                <View style={{ backgroundColor: C.greenDim, paddingHorizontal: 7, paddingVertical: 2, borderRadius: R.full, borderWidth: 1, borderColor: C.green + "30" }}>
                  <Text style={{ color: C.green, fontSize: 10, fontWeight: "700" }}>{"\u2713"}</Text>
                </View>
              )}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="time-outline" size={12} color={C.t3} />
                <Text style={T.small}>{question.createdAt}</Text>
              </View>
            </View>
          </View>

          <Text style={{ ...T.h3, fontSize: compact ? 15 : 18, lineHeight: compact ? 22 : 26, marginBottom: S.xs }} numberOfLines={compact ? 1 : 2}>
            {question.title}
          </Text>

          {!compact && (
            <Text style={{ ...T.body, fontSize: 14, lineHeight: 22, marginBottom: S.md }} numberOfLines={2}>
              {question.body}
            </Text>
          )}

          {question.tags.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: S.md }}>
              {question.tags.slice(0, compact ? 2 : undefined).map(t => <Tag key={t} label={t} />)}
              {compact && question.tags.length > 2 && (
                <View style={{ backgroundColor: C.bg3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.xs }}>
                  <Text style={{ color: C.t2, fontSize: 11, fontWeight: "600" }}>+{question.tags.length - 2}</Text>
                </View>
              )}
            </View>
          )}

          <Divider />

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: S.md }}>
            <Avatar name={authorLabel} size={30} />
            <View style={{ flex: 1, marginLeft: S.sm }}>
              <Text style={{ color: C.accentText, fontSize: 12, fontWeight: "700" }} numberOfLines={1}>
                {authorLabel}
              </Text>
              <Text style={{ color: C.t3, fontSize: 11 }} numberOfLines={1}>{question.college}</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm }}>
              <VoteButton count={question.votes} voted={voted} onPress={onVote} />
              <View style={{
                flexDirection: "row", alignItems: "center", gap: 5,
                backgroundColor: question.answers > 0 ? C.accentAltDim : C.bgSoft,
                paddingHorizontal: 10, paddingVertical: 6, borderRadius: R.sm,
                borderWidth: 1, borderColor: question.answers > 0 ? C.accentAlt + "30" : C.border,
              }}>
                <Ionicons name="chatbubble-ellipses-outline" size={13} color={question.answers > 0 ? C.accentAlt : C.t3} />
                <Text style={{ color: question.answers > 0 ? C.accentAlt : C.t3, fontSize: 13, fontWeight: "700" }}>
                  {question.answers}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {topAnswer && !compact && (
          <View style={{ backgroundColor: C.bgSoft, borderTopWidth: 1, borderTopColor: C.border, padding: S.lg }}>
            <View style={{ flexDirection: "row", gap: S.sm }}>
              <View style={{ width: 3, borderRadius: 2, backgroundColor: topAnswer.isAccepted ? C.green : C.cyan, alignSelf: "stretch", minHeight: 30 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.t3, fontSize: 11, marginBottom: 4 }}>
                  {topAnswer.isAccepted ? `${"\u2713"} Accepted · ` : "Top answer · "}
                  <Text style={{ color: C.accentText, fontWeight: "700" }}>{topAnswerAuthor}</Text>
                </Text>
                <Text style={{ color: C.t2, fontSize: 13, lineHeight: 19 }} numberOfLines={2}>
                  {topAnswer.body}
                </Text>
              </View>
            </View>
          </View>
        )}
      </PressableScale>
    </Animated.View>
  );
}
