import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const DEPARTMENTS = [
  "Computer Science", "Information Technology", "Electronics",
  "Electrical Engineering", "Mechanical Engineering",
  "Civil Engineering", "Mathematics", "Physics",
  "Chemistry", "Commerce", "Economics", "Management",
];

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const inputStyle = (field: string) => ({
    backgroundColor: "#111827",
    color: "#fff" as const,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: focusedField === field ? "#6366F1" : "#1E293B",
    marginBottom: 16,
  });

  const handleRegister = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !college.trim() || !department || !password || !confirmPassword) {
      setError("Please fill in all fields."); return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address."); return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match."); return;
    }
    setLoading(true);
    try {
      const user = { name: name.trim(), email: email.trim().toLowerCase(), college: college.trim(), department, password };
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("userToken", "local_token");
      // Clear any old queries
      await AsyncStorage.removeItem("queries");
      router.replace("/(tabs)/home");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0F1E" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
          <View style={{ height: 3, backgroundColor: "#6366F1" }} />

          <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "#6366F1", fontSize: 15, fontWeight: "600" }}>← Back</Text>
            </TouchableOpacity>
            <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: "#6366F1", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>CQ</Text>
            </View>
            <Text style={{ color: "#fff", fontSize: 32, fontWeight: "800", marginBottom: 6 }}>Join CampusQuery</Text>
            <Text style={{ color: "#64748B", fontSize: 15 }}>Create your student account</Text>
          </View>

          <View style={{ paddingHorizontal: 24 }}>
            {/* Full Name */}
            <Text style={{ color: "#64748B", fontSize: 11, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Full Name</Text>
            <TextInput style={inputStyle("name")} placeholder="e.g. Priya Sharma" placeholderTextColor="#334155" autoCapitalize="words" value={name} onChangeText={setName} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField("")} />

            {/* Email */}
            <Text style={{ color: "#64748B", fontSize: 11, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>College Email</Text>
            <TextInput style={inputStyle("email")} placeholder="you@college.edu" placeholderTextColor="#334155" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField("")} />

            {/* College */}
            <Text style={{ color: "#64748B", fontSize: 11, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>College / University</Text>
            <TextInput style={inputStyle("college")} placeholder="e.g. Delhi University" placeholderTextColor="#334155" autoCapitalize="words" value={college} onChangeText={setCollege} onFocus={() => setFocusedField("college")} onBlur={() => setFocusedField("")} />

            {/* Department picker */}
            <Text style={{ color: "#64748B", fontSize: 11, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Department</Text>
            <TouchableOpacity
              style={{ backgroundColor: "#111827", borderRadius: 14, paddingHorizontal: 18, paddingVertical: 15, borderWidth: 1, borderColor: department ? "#6366F1" : "#1E293B", marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              onPress={() => setShowDeptPicker(!showDeptPicker)}
            >
              <Text style={{ color: department ? "#fff" : "#334155", fontSize: 15 }}>{department || "Select your department"}</Text>
              <Text style={{ color: "#475569" }}>{showDeptPicker ? "▲" : "▼"}</Text>
            </TouchableOpacity>
            {showDeptPicker && (
              <View style={{ backgroundColor: "#111827", borderRadius: 14, borderWidth: 1, borderColor: "#1E293B", marginBottom: 16, overflow: "hidden" }}>
                {DEPARTMENTS.map((d, i) => (
                  <TouchableOpacity
                    key={d}
                    style={{ paddingHorizontal: 18, paddingVertical: 13, borderBottomWidth: i < DEPARTMENTS.length - 1 ? 1 : 0, borderBottomColor: "#1E293B", backgroundColor: department === d ? "#6366F115" : "transparent" }}
                    onPress={() => { setDepartment(d); setShowDeptPicker(false); }}
                  >
                    <Text style={{ color: department === d ? "#818CF8" : "#CBD5E1", fontSize: 14, fontWeight: department === d ? "600" : "400" }}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {!showDeptPicker && <View style={{ marginBottom: 8 }} />}

            {/* Password */}
            <Text style={{ color: "#64748B", fontSize: 11, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Password</Text>
            <TextInput style={inputStyle("password")} placeholder="Min 8 characters" placeholderTextColor="#334155" secureTextEntry value={password} onChangeText={setPassword} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField("")} />

            {/* Confirm */}
            <Text style={{ color: "#64748B", fontSize: 11, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Confirm Password</Text>
            <TextInput style={inputStyle("confirm")} placeholder="Re-enter password" placeholderTextColor="#334155" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} onFocus={() => setFocusedField("confirm")} onBlur={() => setFocusedField("")} onSubmitEditing={handleRegister} />

            {/* Error */}
            {!!error && (
              <View style={{ backgroundColor: "#EF444415", borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#EF444435", flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 14 }}>⚠️</Text>
                <Text style={{ color: "#F87171", fontSize: 13, marginLeft: 6, flex: 1 }}>{error}</Text>
              </View>
            )}

            {/* Terms */}
            <Text style={{ color: "#475569", fontSize: 12, textAlign: "center", lineHeight: 18, marginBottom: 20 }}>
              By creating an account you agree to our{" "}
              <Text style={{ color: "#6366F1" }}>Terms of Service</Text> and{" "}
              <Text style={{ color: "#6366F1" }}>Privacy Policy</Text>.
            </Text>

            <TouchableOpacity
              style={{ backgroundColor: loading ? "#4F46E5" : "#6366F1", borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 16 }}
              onPress={handleRegister} disabled={loading} activeOpacity={0.85}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Create Account 🚀</Text>}
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "#64748B", fontSize: 14 }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login" as any)}>
                <Text style={{ color: "#6366F1", fontWeight: "700", fontSize: 14 }}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
