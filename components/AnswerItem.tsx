import React, { useState } from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { C, S } from "./theme";
import { Answer } from "./types";
import { Avatar, VoteButton, Divider } from "./Atoms";

type Props = { answer: Answer; voted: boolean; onVote: () => void };

export default function AnswerItem({ answer, voted, onVote }: Props) {
  const authorLabel = answer.authorName || answer.author || "Anonymous";
  const [localCount, setLocalCount] = useState(answer.votes);
  const [localVoted, setLocalVoted] = useState(voted);

  const handleVote = () => {
    const newVoted = !localVoted;
    setLocalVoted(newVoted);
    setLocalCount(c => newVoted ? c + 1 : c - 1);
    onVote();
  };

  return (
    <View style={{
      backgroundColor: answer.isAccepted ? C.greenDim : C.bg2,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: answer.isAccepted ? C.green + "40" : C.border,
      padding: S.lg,
      marginBottom: S.lg,
      shadowColor: "#020817",
      shadowOpacity: 0.18,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 16,
      elevation: 3,
    }}>
      {answer.isAccepted && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: S.md }}>
          <Ionicons name="checkmark-circle" size={14} color={C.green} />
          <Text style={{ color: C.green, fontSize: 11, fontWeight: "800", letterSpacing: 0.5 }}>
            ACCEPTED ANSWER
          </Text>
        </View>
      )}

      <Text style={{ color: C.t1, fontSize: 14, lineHeight: 22, marginBottom: S.lg }}>
        {answer.body}
      </Text>

      <Divider />

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: S.md }}>
        <Avatar name={authorLabel} size={30} />
        <View style={{ flex: 1, marginLeft: S.sm }}>
          <Text style={{ color: C.t1, fontSize: 13, fontWeight: "700" }}>{authorLabel}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
            <Ionicons name="school-outline" size={11} color={C.t3} />
            <Text style={{ color: C.t3, fontSize: 11 }}>{answer.college}</Text>
            <Text style={{ color: C.t3, fontSize: 11 }}>·</Text>
            <Ionicons name="time-outline" size={11} color={C.t3} />
            <Text style={{ color: C.t3, fontSize: 11 }}>{answer.createdAt}</Text>
          </View>
        </View>
        <VoteButton count={localCount} voted={localVoted} onPress={handleVote} />
      </View>
    </View>
  );
}

