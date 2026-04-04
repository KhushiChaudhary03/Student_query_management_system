import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const DUMMY_QUERIES: Record<string, any> = {
  "1": {
    id: "1",
    title: "How to solve integration by parts in calculus?",
    body: "I am struggling with integration by parts. Can someone explain the LIATE rule with a step-by-step example? I have my exam in 2 days and I keep making mistakes on ∫x·eˣ dx type problems.",
    author: "Rahul Sharma",
    college: "Delhi University",
    subject: "Mathematics",
    tags: ["Calculus", "Integration", "LIATE"],
    votes: 12,
    createdAt: "2h ago",
    answers: [
      {
        id: "a1",
        author: "Priya Mehta",
        college: "IIT Delhi",
        body: "Integration by parts formula: ∫u dv = uv − ∫v du\n\nLIATE rule for choosing 'u':\n🔵 L — Logarithmic\n🔵 I — Inverse trig\n🔵 A — Algebraic\n🔵 T — Trigonometric\n🔵 E — Exponential\n\nExample: ∫x·eˣ dx\n→ u = x (Algebraic), dv = eˣ dx\n→ du = dx, v = eˣ\n→ = xeˣ − ∫eˣ dx\n→ = xeˣ − eˣ + C\n→ = eˣ(x − 1) + C ✓",
        votes: 8,
        isAccepted: true,
        createdAt: "1h ago",
      },
      {
        id: "a2",
        author: "Arjun Patel",
        college: "NSIT",
        body: "Think of IBP as the reverse of the product rule. A great way to practice is to try ∫x·sin(x) dx and ∫ln(x) dx — once you nail those two, the pattern clicks instantly.",
        votes: 3,
        isAccepted: false,
        createdAt: "45m ago",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Difference between TCP and UDP protocols?",
    body: "For my networking exam, I need a clear comparison of TCP vs UDP. When should we use one over the other?",
    author: "Priya Mehta",
    college: "IIT Delhi",
    subject: "Networking",
    tags: ["TCP", "UDP", "Networking"],
    votes: 24,
    createdAt: "4h ago",
    answers: [],
  },
};

export default function QueryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = DUMMY_QUERIES[id as string] || DUMMY_QUERIES["1"];
  const [answerText, setAnswerText] = useState("");
  const [localVoted, setLocalVoted] = useState(false);
  const [answerVotes, setAnswerVotes] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState(query?.answers || []);
  const scrollRef = useRef<ScrollView>(null);

  const handleSubmit = () => {
    if (!answerText.trim()) return;
    const newAnswer = {
      id: `a${Date.now()}`,
      author: "You",
      college: "Your College",
      body: answerText.trim(),
      votes: 0,
      isAccepted: false,
      createdAt: "Just now",
    };
    setAnswers([...answers, newAnswer]);
    setAnswerText("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F172A" }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {/* Back */}
          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text style={{ color: "#818CF8", fontSize: 15 }}>← Back</Text>
            </TouchableOpacity>
          </View>

          {/* Question card */}
          <View style={{ margin: 16, backgroundColor: "#1E293B", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#334155" }}>
            {/* Subject + time */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <View style={{ backgroundColor: "#6366F120", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 }}>
                <Text style={{ color: "#818CF8", fontSize: 11, fontWeight: "bold" }}>{query.subject}</Text>
              </View>
              <Text style={{ color: "#64748B", fontSize: 11, marginLeft: "auto" }}>{query.createdAt}</Text>
            </View>

            {/* Title */}
            <Text style={{ color: "white", fontSize: 19, fontWeight: "bold", lineHeight: 26, marginBottom: 10 }}>
              {query.title}
            </Text>

            {/* Body */}
            <Text style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 22, marginBottom: 12 }}>
              {query.body}
            </Text>

            {/* Tags */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {query.tags.map((tag: string) => (
                <View key={tag} style={{ backgroundColor: "#0F172A", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 }}>
                  <Text style={{ color: "#94A3B8", fontSize: 11 }}>#{tag}</Text>
                </View>
              ))}
            </View>

            <View style={{ height: 1, backgroundColor: "#334155", marginBottom: 12 }} />

            {/* Author + vote */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#6366F1", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                <Text style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>{query.author.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#818CF8", fontSize: 12, fontWeight: "600" }}>{query.author}</Text>
                <Text style={{ color: "#64748B", fontSize: 11 }}>{query.college}</Text>
              </View>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#0F172A", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}
                onPress={() => setLocalVoted(!localVoted)}
              >
                <Text style={{ color: localVoted ? "#6366F1" : "#94A3B8", fontSize: 15 }}>▲</Text>
                <Text style={{ color: localVoted ? "#6366F1" : "#94A3B8", fontSize: 14, fontWeight: "bold" }}>
                  {query.votes + (localVoted ? 1 : 0)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Answers header */}
          <View style={{ paddingHorizontal: 16, marginBottom: 10, flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>
              {answers.length} Answer{answers.length !== 1 ? "s" : ""}
            </Text>
            {answers.some((a: any) => a.isAccepted) && (
              <View style={{ marginLeft: 8, backgroundColor: "#10B98120", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                <Text style={{ color: "#10B981", fontSize: 11, fontWeight: "600" }}>✓ accepted</Text>
              </View>
            )}
          </View>

          {/* No answers state */}
          {answers.length === 0 && (
            <View style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: "#1E293B", borderRadius: 20, padding: 24, alignItems: "center", borderWidth: 1, borderColor: "#334155" }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>🤔</Text>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>No answers yet</Text>
              <Text style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>Be the first to help!</Text>
            </View>
          )}

          {/* Answer cards */}
          {answers.map((ans: any) => (
            <View
              key={ans.id}
              style={{
                marginHorizontal: 16,
                marginBottom: 12,
                borderRadius: 20,
                padding: 16,
                borderWidth: 1,
                backgroundColor: ans.isAccepted ? "#10B98108" : "#1E293B",
                borderColor: ans.isAccepted ? "#10B98140" : "#334155",
              }}
            >
              {ans.isAccepted && (
                <View style={{ backgroundColor: "#10B98120", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: "flex-start", marginBottom: 10 }}>
                  <Text style={{ color: "#10B981", fontSize: 11, fontWeight: "bold" }}>✓ Accepted Answer</Text>
                </View>
              )}

              <Text style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 22, marginBottom: 14 }}>{ans.body}</Text>

              <View style={{ height: 1, backgroundColor: "#334155", marginBottom: 12 }} />

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: "#334155", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
                  <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>{ans.author.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#CBD5E1", fontSize: 12, fontWeight: "600" }}>{ans.author}</Text>
                  <Text style={{ color: "#64748B", fontSize: 11 }}>{ans.college} · {ans.createdAt}</Text>
                </View>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#0F172A", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 }}
                  onPress={() => setAnswerVotes((prev) => ({ ...prev, [ans.id]: !prev[ans.id] }))}
                >
                  <Text style={{ color: answerVotes[ans.id] ? "#6366F1" : "#94A3B8", fontSize: 13 }}>▲</Text>
                  <Text style={{ color: answerVotes[ans.id] ? "#6366F1" : "#94A3B8", fontSize: 12, fontWeight: "bold" }}>
                    {ans.votes + (answerVotes[ans.id] ? 1 : 0)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Answer input */}
          <View style={{ marginHorizontal: 16, marginTop: 8 }}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
              Write Your Answer
            </Text>
            <TextInput
              style={{
                backgroundColor: "#1E293B",
                color: "white",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 14,
                borderWidth: 1,
                borderColor: "#334155",
                minHeight: 130,
                textAlignVertical: "top",
              }}
              placeholder="Share your knowledge clearly and concisely..."
              placeholderTextColor="#475569"
              multiline
              value={answerText}
              onChangeText={setAnswerText}
              onFocus={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
            />
            <TouchableOpacity
              style={{
                marginTop: 12,
                backgroundColor: answerText.trim() ? "#6366F1" : "#334155",
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
              }}
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={!answerText.trim()}
            >
              <Text style={{ color: answerText.trim() ? "white" : "#64748B", fontWeight: "bold", fontSize: 15 }}>
                Submit Answer ✓
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
