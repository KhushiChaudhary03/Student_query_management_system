import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry",
  "Computer Science", "Data Structures",
  "Computer Networks", "Electrical Engineering",
  "Mechanical Engineering", "Economics", "Management",
];

export default function AskScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0F172A]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-4 pt-14 pb-5">
          <Text className="text-white text-2xl font-bold">Post a Query</Text>
          <Text className="text-slate-400 text-sm mt-1">
            Clear questions get the best answers 💡
          </Text>
        </View>

        <View className="px-4">
          {/* Title */}
          <View className="mb-5">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Title <Text className="text-indigo-400 normal-case tracking-normal">*</Text>
            </Text>
            <TextInput
              className="bg-[#1E293B] text-white rounded-2xl px-5 py-4 text-sm border border-slate-700"
              placeholder="e.g. How does pointer arithmetic work in C?"
              placeholderTextColor="#475569"
              value={title}
              onChangeText={setTitle}
              maxLength={150}
            />
            <Text className="text-slate-600 text-xs mt-1.5 text-right">{title.length}/150</Text>
          </View>

          {/* Subject selector */}
          <View className="mb-5">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Subject <Text className="text-indigo-400 normal-case tracking-normal">*</Text>
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSubject(s)}
                  className={`px-3 py-2 rounded-xl border ${
                    subject === s
                      ? "bg-indigo-500 border-indigo-500"
                      : "bg-[#1E293B] border-slate-700"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      subject === s ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View className="mb-5">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Description <Text className="text-indigo-400 normal-case tracking-normal">*</Text>
            </Text>
            <TextInput
              className="bg-[#1E293B] text-white rounded-2xl px-5 py-4 text-sm border border-slate-700"
              placeholder={
                "Describe your query in detail:\n• What have you tried?\n• What output did you expect?\n• What actually happened?"
              }
              placeholderTextColor="#475569"
              multiline
              numberOfLines={7}
              textAlignVertical="top"
              style={{ minHeight: 160 }}
              value={body}
              onChangeText={setBody}
            />
          </View>

          {/* Tags */}
          <View className="mb-8">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Tags{" "}
              <Text className="text-slate-500 normal-case tracking-normal font-normal">
                (up to 5)
              </Text>
            </Text>
            <View className="flex-row items-center bg-[#1E293B] border border-slate-700 rounded-2xl overflow-hidden">
              <TextInput
                className="flex-1 text-white px-5 py-3.5 text-sm"
                placeholder="Type tag and press +"
                placeholderTextColor="#475569"
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                returnKeyType="done"
              />
              <TouchableOpacity
                className="bg-indigo-500 px-5 py-3.5"
                onPress={addTag}
              >
                <Text className="text-white font-bold text-lg">+</Text>
              </TouchableOpacity>
            </View>

            {tags.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <View
                    key={tag}
                    className="flex-row items-center bg-indigo-500/15 border border-indigo-500/30 rounded-full px-3 py-1"
                  >
                    <Text className="text-indigo-300 text-xs font-medium">#{tag}</Text>
                    <TouchableOpacity onPress={() => removeTag(tag)} className="ml-1.5">
                      <Text className="text-indigo-400 text-sm font-bold leading-none">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            className="bg-indigo-500 rounded-2xl py-4 items-center mb-4 shadow-md"
            onPress={() => router.push("/(tabs)/home")}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">Post Query 🚀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-slate-700 rounded-2xl py-4 items-center mb-10"
            activeOpacity={0.8}
          >
            <Text className="text-slate-400 font-semibold text-sm">Save as Draft</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
