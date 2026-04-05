import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { C, R, S, T } from "./theme";
import { Question } from "./types";
import { Avatar, SubjectPill, Tag, VoteButton, Divider } from "./Atoms";

type Props = {
  question: Question;
  voted: boolean;
  onPress: () => void;
  onVote: () => void;
  compact?: boolean;
};

export default function QuestionCard({ question, voted, onPress, onVote, compact }: Props) {
  const topAnswer = question.answersList?.[0] ?? null;
  const hasAccepted = question.answersList?.some(a => a.isAccepted);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.78}
      style={{
        backgroundColor: C.bg2,
        borderRadius: R.lg,
        borderWidth: 1,
        borderColor: C.border,
        marginBottom: S.md,
        overflow: "hidden",
      }}
    >
      {/* ── Accepted indicator bar ─────────────────────────── */}
      {hasAccepted && (
        <View style={{ height: 2.5, backgroundColor: C.green }} />
      )}

      {/* ── Card body ─────────────────────────────────────── */}
      <View style={{ padding: S.lg }}>

        {/* Row 1 — subject + time */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.sm }}>
          <SubjectPill subject={question.subject} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {hasAccepted && (
              <View style={{ backgroundColor: C.greenDim, paddingHorizontal: 7, paddingVertical: 2,
                borderRadius: R.full, borderWidth: 1, borderColor: C.green + "30" }}>
                <Text style={{ color: C.green, fontSize: 10, fontWeight: "700" }}>✓</Text>
              </View>
            )}
            <Text style={T.small}>{question.createdAt}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={{ ...T.h3, marginBottom: S.xs }} numberOfLines={compact ? 1 : 2}>
          {question.title}
        </Text>

        {/* Body preview */}
        {!compact && (
          <Text style={{ ...T.body, marginBottom: S.md }} numberOfLines={2}>
            {question.body}
          </Text>
        )}

        {/* Tags */}
        {question.tags.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: S.md }}>
            {question.tags.slice(0, compact ? 2 : undefined).map(t => <Tag key={t} label={t} />)}
            {compact && question.tags.length > 2 && (
              <View style={{ backgroundColor: C.bg3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.xs }}>
                <Text style={{ color: C.t3, fontSize: 11 }}>+{question.tags.length - 2}</Text>
              </View>
            )}
          </View>
        )}

        <Divider />

        {/* Author + stats */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: S.md }}>
          <Avatar name={question.author} size={28} />
          <View style={{ flex: 1, marginLeft: S.sm }}>
            <Text style={{ color: C.accentText, fontSize: 12, fontWeight: "600" }} numberOfLines={1}>
              {question.author}
            </Text>
            <Text style={{ color: C.t3, fontSize: 11 }} numberOfLines={1}>{question.college}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm }}>
            {/* Vote */}
            <VoteButton count={question.votes} voted={voted} onPress={onVote} />

            {/* Answer count */}
            <View style={{
              flexDirection: "row", alignItems: "center", gap: 4,
              backgroundColor: question.answers > 0 ? C.greenDim : C.bg3,
              paddingHorizontal: 10, paddingVertical: 6, borderRadius: R.sm,
              borderWidth: 1, borderColor: question.answers > 0 ? C.green + "30" : C.border,
            }}>
              <Text style={{ fontSize: 12 }}>💬</Text>
              <Text style={{
                color: question.answers > 0 ? C.green : C.t3,
                fontSize: 13, fontWeight: "700",
              }}>
                {question.answers}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Top answer preview ─────────────────────────────── */}
      {topAnswer && !compact && (
        <View style={{
          backgroundColor: C.bg1,
          borderTopWidth: 1, borderTopColor: C.border,
          padding: S.lg,
        }}>
          <View style={{ flexDirection: "row", gap: S.sm }}>
            <View style={{
              width: 3, borderRadius: 2,
              backgroundColor: topAnswer.isAccepted ? C.green : C.accent,
              alignSelf: "stretch", minHeight: 30,
            }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.t3, fontSize: 11, marginBottom: 4 }}>
                {topAnswer.isAccepted ? "✓ Accepted  ·  " : "Top answer  ·  "}
                <Text style={{ color: C.accentText, fontWeight: "600" }}>{topAnswer.author}</Text>
              </Text>
              <Text style={{ color: C.t2, fontSize: 13, lineHeight: 19 }} numberOfLines={2}>
                {topAnswer.body}
              </Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
