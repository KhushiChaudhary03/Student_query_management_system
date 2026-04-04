import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0F172A]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top decoration */}
        <View className="h-1 bg-indigo-500 w-full" />

        {/* Header */}
        <View className="px-6 pt-16 pb-10">
          <View className="w-16 h-16 rounded-2xl bg-indigo-500 items-center justify-center mb-8 shadow-lg">
            <Text className="text-white text-3xl font-bold">CQ</Text>
          </View>
          <Text className="text-white text-4xl font-bold mb-2">Welcome back</Text>
          <Text className="text-slate-400 text-base">Sign in to CampusQuery</Text>
        </View>

        {/* Form */}
        <View className="px-6 flex-1">
          {/* Email */}
          <View className="mb-5">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              College Email
            </Text>
            <TextInput
              className="bg-[#1E293B] text-white rounded-2xl px-5 py-4 text-base border border-slate-700"
              placeholder="you@college.edu"
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View className="mb-2">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Password
            </Text>
            <TextInput
              className="bg-[#1E293B] text-white rounded-2xl px-5 py-4 text-base border border-slate-700"
              placeholder="••••••••"
              placeholderTextColor="#475569"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Forgot password */}
          <TouchableOpacity className="self-end mb-8">
            <Text className="text-indigo-400 text-sm">Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign in button */}
          <TouchableOpacity
            className="bg-indigo-500 rounded-2xl py-4 items-center shadow-md mb-4"
            onPress={() => router.replace("/(tabs)/home")}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base tracking-wide">Sign In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-slate-700" />
            <Text className="text-slate-500 mx-4 text-xs">OR</Text>
            <View className="flex-1 h-px bg-slate-700" />
          </View>

          {/* Google placeholder */}
          <TouchableOpacity className="border border-slate-700 rounded-2xl py-4 items-center flex-row justify-center mb-8">
            <Text className="text-xl mr-3">🎓</Text>
            <Text className="text-slate-300 font-semibold">Continue with College SSO</Text>
          </TouchableOpacity>

          {/* Register link */}
          <View className="flex-row items-center justify-center">
            <Text className="text-slate-400">New student? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="text-indigo-400 font-bold">Create account →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
