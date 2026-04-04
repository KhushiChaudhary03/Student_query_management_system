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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const fields = [
    { label: "Full Name", placeholder: "John Doe", value: name, setter: setName, keyboard: "default", caps: "words", secure: false },
    { label: "College Email", placeholder: "you@college.edu", value: email, setter: setEmail, keyboard: "email-address", caps: "none", secure: false },
    { label: "College / University", placeholder: "e.g. Delhi University", value: college, setter: setCollege, keyboard: "default", caps: "words", secure: false },
    { label: "Department", placeholder: "e.g. Computer Science", value: department, setter: setDepartment, keyboard: "default", caps: "words", secure: false },
    { label: "Password", placeholder: "Min 8 characters", value: password, setter: setPassword, keyboard: "default", caps: "none", secure: true },
    { label: "Confirm Password", placeholder: "Re-enter password", value: confirmPassword, setter: setConfirmPassword, keyboard: "default", caps: "none", secure: true },
  ];

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !college || !department || !password || !confirmPassword) {
      setError("Please fill in all fields."); return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }

    const user = { name, email, college, department };
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("userToken", "local_token");
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F172A" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={{ height: 4, backgroundColor: "#6366F1" }} />

          <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
              <Text style={{ color: "#818CF8", fontSize: 15 }}>← Back</Text>
            </TouchableOpacity>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#6366F1", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>CQ</Text>
            </View>
            <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 4 }}>Join CampusQuery</Text>
            <Text style={{ color: "#94A3B8", fontSize: 14 }}>Create your student account</Text>
          </View>

          <View style={{ paddingHorizontal: 24 }}>
            {fields.map((field, index) => (
              <View key={field.label} style={{ marginBottom: 16 }}>
                <Text style={{ color: "#94A3B8", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                  {field.label}
                </Text>
                <TextInput
                  style={{ backgroundColor: "#1E293B", color: "white", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, fontSize: 15, borderWidth: 1, borderColor: "#334155" }}
                  placeholder={field.placeholder}
                  placeholderTextColor="#475569"
                  keyboardType={field.keyboard as any}
                  autoCapitalize={field.caps as any}
                  secureTextEntry={field.secure}
                  value={field.value}
                  onChangeText={field.setter}
                  returnKeyType={index === fields.length - 1 ? "done" : "next"}
                />
              </View>
            ))}

            {/* Error message */}
            {error ? (
              <View style={{ backgroundColor: "#EF444420", borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#EF444440" }}>
                <Text style={{ color: "#EF4444", fontSize: 13 }}>⚠️  {error}</Text>
              </View>
            ) : null}

            <Text style={{ color: "#64748B", fontSize: 12, textAlign: "center", lineHeight: 18, marginTop: 4, marginBottom: 20 }}>
              By creating an account, you agree to our{" "}
              <Text style={{ color: "#818CF8" }}>Terms of Service</Text> and{" "}
              <Text style={{ color: "#818CF8" }}>Privacy Policy</Text>.
            </Text>

            <TouchableOpacity
              style={{ backgroundColor: "#6366F1", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginBottom: 16 }}
              onPress={handleRegister}
              activeOpacity={0.85}
            >
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Create Account 🚀</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "#94A3B8" }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login" as any)}>
                <Text style={{ color: "#818CF8", fontWeight: "bold" }}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
