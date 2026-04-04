import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Query = {
  id: string;
  title: string;
  body: string;
  author: string;
  college: string;
  subject: string;
  tags: string[];
  answers: number;
  votes: number;
  createdAt: string;
};

const DUMMY_QUERIES: Query[] = [
  {
    id: "1",
    title: "How to solve integration by parts in calculus?",
    body: "I am struggling with integration by parts. Can someone explain the LIATE rule with a step-by-step example?",
    author: "ABC",
    college: "Delhi University",
    subject: "Mathematics",
    tags: ["Calculus", "Integration"],
    answers: 5,
    votes: 12,
    createdAt: "2h ago",
  },
  {
    id: "2",
    title: "Difference between TCP and UDP protocols?",
    body: "For my networking exam, I need a clear comparison of TCP vs UDP with real-world examples.",
    author: "Priya Mehta",
    college: "IIT Delhi",
    subject: "Networking",
    tags: ["TCP", "UDP", "Networking"],
    answers: 8,
    votes: 24,
    createdAt: "4h ago",
  },
  {
    id: "3",
    title: "Best resources for learning Data Structures?",
    body: "I'm in 2nd year CSE. Which books or YouTube channels are best for DSA prep?",
    author: "Arjun Patel",
    college: "NSIT",
    subject: "DSA",
    tags: ["DSA", "Resources", "CSE"],
    answers: 15,
    votes: 38,
    createdAt: "1d ago",
  },
  {
    id: "4",
    title: "How does Kirchhoff's Voltage Law work?",
    body: "Can someone explain KVL with a circuit example? I keep getting wrong answers in practice problems.",
    author: "Sneha Roy",
    college: "NIT Trichy",
    subject: "Electrical",
    tags: ["KVL", "Circuits"],
    answers: 3,
    votes: 7,
    createdAt: "2d ago",
  },
  {
    id: "5",
    title: "Explain the OSI model layers simply?",
    body: "I keep confusing the 7 layers. Is there a simple trick to remember them all?",
    author: "Karan Singh",
    college: "BITS Pilani",
    subject: "Networking",
    tags: ["OSI", "Networking"],
    answers: 6,
    votes: 19,
    createdAt: "3d ago",
  },
];

const SUBJECTS = ["All", "Mathematics", "Networking", "DSA", "Electrical", "Physics"];

const SUBJECT_COLORS: Record<string, { bg: string; text: string }> = {
  Mathematics: { bg: "#F59E0B20", text: "#F59E0B" },
  Networking:  { bg: "#10B98120", text: "#10B981" },
  DSA:         { bg: "#6366F120", text: "#818CF8" },
  Electrical:  { bg: "#EF444420", text: "#EF4444" },
  Physics:     { bg: "#3B82F620", text: "#3B82F6" },
  Chemistry:   { bg: "#EC489920", text: "#EC4899" },
};

function QueryCard({ query }: { query: Query }) {
  const [voted, setVoted] = useState(false);
  const color = SUBJECT_COLORS[query.subject] || { bg: "#6366F120", text: "#818CF8" };

  return (
    <TouchableOpacity
      style={{ backgroundColor: "#1E293B", borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#334155" }}
      onPress={() => router.push(`/query/${query.id}` as any)}
      activeOpacity={0.8}
    >
      {/* Subject + Time */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <View style={{ backgroundColor: color.bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginRight: 8 }}>
          <Text style={{ color: color.text, fontSize: 11, fontWeight: "bold" }}>{query.subject}</Text>
        </View>
        <Text style={{ color: "#64748B", fontSize: 11, marginLeft: "auto" }}>{query.createdAt}</Text>
      </View>

      {/* Title */}
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 15, lineHeight: 22, marginBottom: 4 }} numberOfLines={2}>
        {query.title}
      </Text>

      {/* Body preview */}
      <Text style={{ color: "#94A3B8", fontSize: 13, lineHeight: 20, marginBottom: 10 }} numberOfLines={2}>
        {query.body}
      </Text>

      {/* Tags */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10, gap: 6 }}>
        {query.tags.map((tag) => (
          <View key={tag} style={{ backgroundColor: "#0F172A", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
            <Text style={{ color: "#94A3B8", fontSize: 11 }}>#{tag}</Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: "#334155", marginBottom: 10 }} />

      {/* Footer */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: "#6366F1", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
          <Text style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{query.author.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#94A3B8", fontSize: 11 }} numberOfLines={1}>
            <Text style={{ color: "#818CF8", fontWeight: "600" }}>{query.author}</Text>
            {"  ·  "}{query.college}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }} onPress={() => setVoted(!voted)}>
            <Text style={{ color: voted ? "#6366F1" : "#64748B", fontSize: 14 }}>▲</Text>
            <Text style={{ color: voted ? "#6366F1" : "#94A3B8", fontSize: 12, fontWeight: "bold" }}>
              {query.votes + (voted ? 1 : 0)}
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 13 }}>💬</Text>
            <Text style={{ color: "#94A3B8", fontSize: 12, fontWeight: "bold" }}>{query.answers}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [userName, setUserName] = useState("?");

  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) {
        const user = JSON.parse(data);
        // Get initials from real user name
        const initials = user.name
          ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
          : "?";
        setUserName(initials);
      }
    });
  }, []);

  const filtered = DUMMY_QUERIES.filter((q) => {
    const matchSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchSubject = selectedSubject === "All" || q.subject === selectedSubject;
    return matchSearch && matchSubject;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <View>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>CampusQuery</Text>
            <Text style={{ color: "#64748B", fontSize: 11 }}>Ask · Answer · Learn</Text>
          </View>
          {/* Avatar shows real user initials */}
          <TouchableOpacity
            style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#6366F1", alignItems: "center", justifyContent: "center" }}
            onPress={() => router.push("/(tabs)/profile" as any)}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{userName}</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={{ marginTop: 16, backgroundColor: "#1E293B", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#334155" }}>
          <Text style={{ color: "#64748B", marginRight: 8, fontSize: 15 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, color: "white", fontSize: 14 }}
            placeholder="Search queries, tags, subjects..."
            placeholderTextColor="#475569"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={{ color: "#64748B", fontSize: 15 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Subject chips */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={SUBJECTS}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedSubject(item)}
            style={{ paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1, backgroundColor: selectedSubject === item ? "#6366F1" : "transparent", borderColor: selectedSubject === item ? "#6366F1" : "#334155" }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: selectedSubject === item ? "white" : "#94A3B8" }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Count */}
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <Text style={{ color: "#64748B", fontSize: 12 }}>{filtered.length} queries</Text>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <QueryCard query={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>No results found</Text>
            <Text style={{ color: "#94A3B8", fontSize: 13, marginTop: 6, textAlign: "center" }}>
              Try a different search term or subject
            </Text>
          </View>
        }
      />
    </View>
  );
}
