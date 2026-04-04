import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const MY_QUERIES = [
  {
    id: "1",
    title: "How to solve integration by parts in calculus?",
    subject: "Mathematics",
    answers: 5,
    votes: 12,
    status: "answered",
    createdAt: "2h ago",
  },
  {
    id: "5",
    title: "What is the difference between stack and heap memory?",
    subject: "Computer Science",
    answers: 0,
    votes: 2,
    status: "unanswered",
    createdAt: "5h ago",
  },
  {
    id: "6",
    title: "Explain the concept of polymorphism in OOP with example",
    subject: "Computer Science",
    answers: 2,
    votes: 5,
    status: "answered",
    createdAt: "1d ago",
  },
];

const STATUS_MAP = {
  answered:   { bg: "#10B98115", border: "#10B98140", text: "#10B981", label: "✓ Answered" },
  unanswered: { bg: "#F59E0B15", border: "#F59E0B40", text: "#F59E0B", label: "⏳ Awaiting" },
};

export default function MyQueriesScreen() {
  return (
    <View className="flex-1 bg-[#0F172A]">
      {/* Header */}
      <View className="px-4 pt-14 pb-4">
        <Text className="text-white text-2xl font-bold">My Queries</Text>
        <Text className="text-slate-400 text-sm mt-1">{MY_QUERIES.length} queries posted</Text>
      </View>

      {/* Stats row */}
      <View className="flex-row px-4 mb-4 gap-3">
        {[
          { label: "Total", value: MY_QUERIES.length, color: "#6366F1" },
          { label: "Answered", value: MY_QUERIES.filter((q) => q.status === "answered").length, color: "#10B981" },
          { label: "Pending", value: MY_QUERIES.filter((q) => q.status === "unanswered").length, color: "#F59E0B" },
        ].map((stat) => (
          <View
            key={stat.label}
            className="flex-1 bg-[#1E293B] rounded-2xl py-3 items-center border border-slate-700/50"
          >
            <Text className="text-xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </Text>
            <Text className="text-slate-500 text-xs mt-0.5">{stat.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={MY_QUERIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const st = STATUS_MAP[item.status as keyof typeof STATUS_MAP];
          return (
            <TouchableOpacity
              className="bg-[#1E293B] rounded-2xl p-4 mb-3 border border-slate-700/50"
              onPress={() => router.push(`/query/${item.id}` as any)}
              activeOpacity={0.8}
            >
              {/* Status + time */}
              <View className="flex-row items-center mb-2">
                <View
                  className="px-2.5 py-0.5 rounded-full border"
                  style={{ backgroundColor: st.bg, borderColor: st.border }}
                >
                  <Text className="text-xs font-bold" style={{ color: st.text }}>
                    {st.label}
                  </Text>
                </View>
                <Text className="text-slate-500 text-xs ml-auto">{item.createdAt}</Text>
              </View>

              {/* Title */}
              <Text className="text-white font-bold text-[15px] leading-snug mb-3" numberOfLines={2}>
                {item.title}
              </Text>

              {/* Subject + stats */}
              <View className="flex-row items-center">
                <Text className="text-slate-500 text-xs">{item.subject}</Text>
                <View className="flex-row items-center ml-auto gap-4">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-slate-500 text-sm">▲</Text>
                    <Text className="text-slate-400 text-xs font-semibold">{item.votes}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-slate-500 text-sm">💬</Text>
                    <Text className="text-slate-400 text-xs font-semibold">{item.answers}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View className="items-center justify-center py-24">
            <Text className="text-5xl mb-4">📭</Text>
            <Text className="text-white font-bold text-lg">No queries yet</Text>
            <Text className="text-slate-400 text-sm mt-1 text-center mb-6">
              Post your first query and get help from peers!
            </Text>
            <TouchableOpacity
              className="bg-indigo-500 px-6 py-3 rounded-xl"
              onPress={() => router.push("/(tabs)/ask")}
            >
              <Text className="text-white font-bold">Ask a Question</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
