import React from "react";
import { View, Text } from "react-native";
import { C, R, S, T } from "./theme";
import { Answer } from "./types";
import { Avatar, VoteButton, Divider } from "./Atoms";

type Props = { answer: Answer; voted: boolean; onVote: () => void };

export default function AnswerItem({ answer, voted, onVote }: Props) {
  return (
    <View style={{
      backgroundColor: answer.isAccepted ? C.greenDim : C.bg2,
      borderRadius: R.lg,
      borderWidth: 1,
      borderColor: answer.isAccepted ? C.green + "40" : C.border,
      padding: S.lg,
      marginBottom: S.md,
    }}>
      {answer.isAccepted && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: S.md }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.green }} />
          <Text style={{ color: C.green, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>
            ACCEPTED ANSWER
          </Text>
        </View>
      )}

      <Text style={{ color: C.t1, fontSize: 14, lineHeight: 22, marginBottom: S.lg }}>
        {answer.body}
      </Text>

      <Divider />

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: S.md }}>
        <Avatar name={answer.author} size={28} />
        <View style={{ flex: 1, marginLeft: S.sm }}>
          <Text style={{ color: C.t1, fontSize: 12, fontWeight: "600" }}>{answer.author}</Text>
          <Text style={{ color: C.t3, fontSize: 11 }}>{answer.college} · {answer.createdAt}</Text>
        </View>
        <VoteButton count={answer.votes} voted={voted} onPress={onVote} />
      </View>
    </View>
  );
}
