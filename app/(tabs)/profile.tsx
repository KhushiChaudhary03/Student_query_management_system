import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { C, R, S, T } from "../../components/theme";
import { Avatar, Divider, PrimaryButton, GhostButton } from "../../components/Atoms";
import PressableScale from "../../components/PressableScale";
import BrandedLoader from "../../components/BrandedLoader";
import EmptyState from "../../components/EmptyState";
import { UserProfile } from "../../components/types";
import { currentUser, getUserProfile, updateUserProfile, logoutUser } from "../../firebase/auth";
import {
  AppSettings,
  DEFAULT_SETTINGS,
  getAppSettings,
  saveAppSettings,
  subscribeToAppSettings,
} from "../../store/settings";
import {
  SavedQuestion,
  getSavedQuestions,
  removeSavedQuestion,
  subscribeToSavedQuestions,
} from "../../store/savedQuestions";

function EditProfileModal({ user, onSave, onClose }: {
  user: UserProfile;
  onSave: (u: UserProfile) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(user.name);
  const [college, setCollege] = useState(user.college);
  const [dept, setDept] = useState(user.department);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile(user.uid, {
        name: name.trim(),
        college: college.trim(),
        department: dept.trim(),
      });
      onSave({ ...user, name: name.trim(), college: college.trim(), department: dept.trim() });
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Failed to save. Try again.");
      setLoading(false);
    }
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: C.bg1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: S.xxl, borderTopWidth: 1, borderTopColor: C.border }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: S.xl }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: C.t1 }}>Edit Profile</Text>
              <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.t3} /></TouchableOpacity>
            </View>
            {[
              { label: "Name", val: name, set: setName, icon: "person-outline" },
              { label: "College", val: college, set: setCollege, icon: "school-outline" },
              { label: "Department", val: dept, set: setDept, icon: "layers-outline" },
            ].map(({ label, val, set, icon }) => (
              <View key={label} style={{ marginBottom: S.lg }}>
                <Text style={{ ...T.label, marginBottom: S.sm }}>{label}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: C.bgSoft, borderRadius: R.md, borderWidth: 1.5, borderColor: C.border }}>
                  <Ionicons name={icon as any} size={16} color={C.t3} style={{ marginLeft: S.lg, marginRight: 10 }} />
                  <TextInput style={{ flex: 1, color: C.t1, paddingVertical: 13, paddingRight: S.lg, fontSize: 14 }} value={val} onChangeText={set} placeholderTextColor={C.t3} />
                </View>
              </View>
            ))}
            {!!error && <Text style={{ color: C.red, fontSize: 13, marginBottom: S.md }}>{error}</Text>}
            <View style={{ gap: S.md }}>
              <PrimaryButton label="Save Changes" onPress={save} loading={loading} />
              <GhostButton label="Cancel" onPress={onClose} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function InfoModal({ title, icon, body, onClose }: {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  body: string;
  onClose: () => void;
}) {
  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: C.bg1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: S.xxl, minHeight: 300, borderTopWidth: 1, borderTopColor: C.border }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: S.xl }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: C.t1 }}>{title}</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.t3} /></TouchableOpacity>
          </View>
          <View style={{ alignItems: "center", paddingVertical: S.xxxl }}>
            <View style={{ width: 72, height: 72, borderRadius: 24, backgroundColor: C.bgSoft, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center", marginBottom: S.lg }}>
              <Ionicons name={icon} size={34} color={C.cyan} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: "800", color: C.t1, marginBottom: S.sm }}>{body}</Text>
            <Text style={{ color: C.t3, fontSize: 13, textAlign: "center" }}>This feature is coming soon.</Text>
          </View>
          <GhostButton label="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

function SavedQuestionsModal({
  saved,
  onClose,
  onOpen,
  onRemove,
}: {
  saved: SavedQuestion[];
  onClose: () => void;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: C.bg1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: S.xxl, borderTopWidth: 1, borderTopColor: C.border, minHeight: 340 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: S.xl }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "800", color: C.t1 }}>Saved Questions</Text>
              <Text style={{ color: C.t3, fontSize: 12, marginTop: 3 }}>{saved.length} bookmarked</Text>
            </View>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.t3} /></TouchableOpacity>
          </View>

          {saved.length === 0 ? (
            <EmptyState icon="bookmark-outline" iconColor={C.sun} iconBg={C.sunDim} title="No saved questions yet" body="Bookmark questions from the feed or detail page and they will appear here." />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: S.md }}>
              {saved.map((item, index) => (
                <View key={item.id} style={{ backgroundColor: C.bg2, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: S.lg, marginBottom: S.md }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: S.sm }}>
                    <Text style={{ color: C.sun, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.6 }}>{item.subject}</Text>
                    <Text style={{ color: C.t3, fontSize: 11 }}>{item.createdAt}</Text>
                  </View>
                  <Text style={{ color: C.t1, fontSize: 15, fontWeight: "800", marginBottom: 6 }}>{item.title}</Text>
                  <Text style={{ color: C.t3, fontSize: 12, marginBottom: S.md }}>{item.college}</Text>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Ionicons name="arrow-up" size={12} color={C.rose} />
                        <Text style={{ color: C.t2, fontSize: 12, fontWeight: "700" }}>{item.votes}</Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Ionicons name="chatbubble-ellipses-outline" size={12} color={C.accentAlt} />
                        <Text style={{ color: C.t2, fontSize: 12, fontWeight: "700" }}>{item.answers}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <PressableScale onPress={() => onOpen(item.id)} activeScale={0.96} style={{ backgroundColor: C.accentDim, borderRadius: R.full, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.accent + "30" }}>
                        <Text style={{ color: C.accentText, fontSize: 12, fontWeight: "800" }}>Open</Text>
                      </PressableScale>
                      <PressableScale onPress={() => onRemove(item.id)} activeScale={0.96} style={{ backgroundColor: C.redDim, borderRadius: R.full, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.red + "30" }}>
                        <Text style={{ color: C.red, fontSize: 12, fontWeight: "800" }}>Remove</Text>
                      </PressableScale>
                    </View>
                  </View>
                  {index < saved.length - 1 ? null : null}
                </View>
              ))}
            </ScrollView>
          )}

          <GhostButton label="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

function SettingsModal({
  initialSettings,
  onClose,
  onLogout,
  onSave,
}: {
  initialSettings: AppSettings;
  onClose: () => void;
  onLogout: () => void;
  onSave: (settings: AppSettings) => Promise<void>;
}) {
  const [pushEnabled, setPushEnabled] = useState(initialSettings.pushEnabled);
  const [compactMode, setCompactMode] = useState(initialSettings.compactMode);
  const [hideSolvedQuestions, setHideSolvedQuestions] = useState(initialSettings.hideSolvedQuestions);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPushEnabled(initialSettings.pushEnabled);
    setCompactMode(initialSettings.compactMode);
    setHideSolvedQuestions(initialSettings.hideSolvedQuestions);
  }, [initialSettings]);

  const savePreferences = async () => {
    setSaving(true);
    try {
      await onSave({ pushEnabled, compactMode, hideSolvedQuestions });
      Alert.alert("Settings updated", "Your preferences were saved on this device.");
      onClose();
    } catch {
      Alert.alert("Could not save", "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: C.bg1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: S.xxl, borderTopWidth: 1, borderTopColor: C.border }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: S.xl }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: C.t1 }}>Settings</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.t3} /></TouchableOpacity>
          </View>

          <View style={{ backgroundColor: C.bg2, borderRadius: 22, borderWidth: 1, borderColor: C.border, padding: S.lg, marginBottom: S.lg }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, paddingRight: S.md }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.cyanDim, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="notifications-outline" size={18} color={C.cyan} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.t1, fontSize: 14, fontWeight: "700" }}>Push Notifications</Text>
                  <Text style={{ color: C.t3, fontSize: 12, marginTop: 2 }}>Show unread badges and alert activity</Text>
                </View>
              </View>
              <Switch value={pushEnabled} onValueChange={setPushEnabled} thumbColor="#ffffff" trackColor={{ false: C.borderLight, true: C.accent }} />
            </View>

            <View style={{ marginVertical: S.lg }}><Divider /></View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, paddingRight: S.md }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.accentAltDim, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="phone-portrait-outline" size={18} color={C.accentAlt} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.t1, fontSize: 14, fontWeight: "700" }}>Compact Mode</Text>
                  <Text style={{ color: C.t3, fontSize: 12, marginTop: 2 }}>Tighten spacing across the main screens</Text>
                </View>
              </View>
              <Switch value={compactMode} onValueChange={setCompactMode} thumbColor="#ffffff" trackColor={{ false: C.borderLight, true: C.accentAlt }} />
            </View>

            <View style={{ marginVertical: S.lg }}><Divider /></View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, paddingRight: S.md }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.sunDim, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="checkmark-done-outline" size={18} color={C.sun} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.t1, fontSize: 14, fontWeight: "700" }}>Hide Solved Questions</Text>
                  <Text style={{ color: C.t3, fontSize: 12, marginTop: 2 }}>Show only open questions on the home feed</Text>
                </View>
              </View>
              <Switch value={hideSolvedQuestions} onValueChange={setHideSolvedQuestions} thumbColor="#ffffff" trackColor={{ false: C.borderLight, true: C.sun }} />
            </View>
          </View>

          <View style={{ backgroundColor: C.bg2, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: S.lg, marginBottom: S.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="information-circle-outline" size={18} color={C.t2} />
              <Text style={{ color: C.t2, fontSize: 13, fontWeight: "600" }}>App Version</Text>
            </View>
            <Text style={{ color: C.t3, fontSize: 13 }}>1.0.0</Text>
          </View>

          <View style={{ gap: S.md }}>
            <PrimaryButton label="Save Preferences" onPress={savePreferences} loading={saving} />
            <PressableScale onPress={onLogout} activeScale={0.97} style={{ backgroundColor: C.redDim, borderWidth: 1.5, borderColor: C.red + "30", borderRadius: R.md, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}>
              <Ionicons name="log-out-outline" size={16} color={C.red} />
              <Text style={{ color: C.red, fontWeight: "800", fontSize: 15 }}>Log Out</Text>
            </PressableScale>
            <GhostButton label="Close" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

type ModalType = "edit" | "answers" | "saved" | "settings" | null;

function StatCard({ label, value, color, bg, icon }: { label: string; value: number; color: string; bg: string; icon: React.ComponentProps<typeof Ionicons>["name"] }) {
  return (
    <View style={{ flex: 1, backgroundColor: bg, borderRadius: R.md, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: color + "25" }}>
      <Ionicons name={icon} size={16} color={color} style={{ marginBottom: 6 }} />
      <Text style={{ color, fontSize: 24, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: C.t3, fontSize: 11, fontWeight: "700", marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState<SavedQuestion[]>([]);

  const load = useCallback(async () => {
    try {
      const user = currentUser();
      const [localSettings, profileData, savedQuestions] = await Promise.all([
        getAppSettings(),
        user ? getUserProfile(user.uid) : Promise.resolve(null),
        getSavedQuestions(),
      ]);
      setSettings(localSettings);
      setSaved(savedQuestions);
      if (profileData) setProfile(profileData);
    } catch (e) {
      console.error("Failed to load profile:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => subscribeToAppSettings(setSettings), []);
  useEffect(() => subscribeToSavedQuestions(setSaved), []);

  const handleSaveSettings = async (next: AppSettings) => {
    await saveAppSettings(next);
    setSettings(next);
  };

  const handleOpenSaved = (id: string) => {
    setModal(null);
    router.push(`/query/${id}` as any);
  };

  const handleRemoveSaved = async (id: string) => {
    await removeSavedQuestion(id);
  };

  const logout = () => {
    setModal(null);
    Alert.alert("Log Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutUser();
          } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Logout failed.");
          }
        },
      },
    ]);
  };

  const MENU = [
    { icon: "document-text-outline", label: "My Questions", sub: "View your posted questions", onPress: () => router.push("/(tabs)/my-queries" as any), tone: C.roseDim, iconColor: C.rose },
    { icon: "notifications-outline", label: "Notifications", sub: settings.pushEnabled ? "Activity and replies" : "Alerts muted on this device", onPress: () => router.push("/(tabs)/notifications" as any), tone: C.cyanDim, iconColor: C.cyan },
    { icon: "chatbubble-ellipses-outline", label: "My Answers", sub: "Answers you have given", onPress: () => setModal("answers"), tone: C.accentAltDim, iconColor: C.accentAlt },
    { icon: "bookmark-outline", label: "Saved", sub: saved.length > 0 ? `${saved.length} bookmarked question${saved.length === 1 ? "" : "s"}` : "Bookmarked questions", onPress: () => setModal("saved"), tone: C.sunDim, iconColor: C.sun },
    { icon: "settings-outline", label: "Settings", sub: settings.hideSolvedQuestions ? "Hiding solved questions" : settings.compactMode ? "Compact mode enabled" : "Account preferences", onPress: () => setModal("settings"), tone: C.accentDim, iconColor: C.accent },
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg0 }}>
        <View style={{ backgroundColor: C.bg1, paddingHorizontal: S.lg, paddingTop: 50, paddingBottom: S.lg, borderBottomWidth: 1, borderBottomColor: C.border }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: C.t1 }}>Profile</Text>
        </View>
        <BrandedLoader title="Loading your profile" subtitle="Setting up your stats, saved items, and preferences." compact />
      </View>
    );
  }

  const name = profile?.name || "Student";

  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      {modal === "edit" && profile && <EditProfileModal user={profile} onSave={setProfile} onClose={() => setModal(null)} />}
      {modal === "answers" && <InfoModal title="My Answers" icon="chatbubble-ellipses-outline" body="No answers given yet" onClose={() => setModal(null)} />}
      {modal === "saved" && <SavedQuestionsModal saved={saved} onClose={() => setModal(null)} onOpen={handleOpenSaved} onRemove={handleRemoveSaved} />}
      {modal === "settings" && <SettingsModal initialSettings={settings} onClose={() => setModal(null)} onLogout={logout} onSave={handleSaveSettings} />}

      <View style={{ backgroundColor: C.bg1, paddingHorizontal: S.lg, paddingTop: 50, paddingBottom: S.lg, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View>
          <Text style={{ color: C.t3, fontSize: 12, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase" }}>Profile</Text>
          <Text style={{ ...T.small, color: C.t2, marginTop: 4 }}>Manage your account and activity.</Text>
        </View>
        <PressableScale onPress={() => setModal("edit")} activeScale={0.96} style={{ backgroundColor: C.bgSoft, paddingHorizontal: 14, paddingVertical: 8, borderRadius: R.full, borderWidth: 1, borderColor: C.border, flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="create-outline" size={14} color={C.accentText} />
          <Text style={{ color: C.accentText, fontSize: 12, fontWeight: "800" }}>Edit</Text>
        </PressableScale>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <View style={{ margin: S.lg, backgroundColor: C.bg2, borderRadius: 24, padding: S.xxl, alignItems: "center", borderWidth: 1, borderColor: C.border, shadowColor: "#020817", shadowOpacity: 0.22, shadowOffset: { width: 0, height: 12 }, shadowRadius: 18, elevation: 4 }}>
          <Avatar name={name} size={84} />
          <Text style={{ fontSize: 22, fontWeight: "800", color: C.t1, marginTop: S.lg, marginBottom: 4 }}>{name}</Text>
          <Text style={{ color: C.t3, fontSize: 13, marginBottom: S.sm }}>{profile?.email || "-"}</Text>
          {profile?.college ? (
            <View style={{ backgroundColor: C.accentDim, paddingHorizontal: 14, paddingVertical: 6, borderRadius: R.full, marginBottom: 6, borderWidth: 1, borderColor: C.accent + "30", flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="school-outline" size={14} color={C.accentText} />
              <Text style={{ color: C.accentText, fontSize: 12, fontWeight: "700" }}>{profile.college}</Text>
            </View>
          ) : null}
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 4 }}>
            {profile?.department ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="layers-outline" size={12} color={C.t3} />
                <Text style={{ color: C.t3, fontSize: 12 }}>{profile.department}</Text>
              </View>
            ) : null}
            {settings.compactMode ? (
              <View style={{ backgroundColor: C.accentAltDim, borderRadius: R.full, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: C.accentAlt + "30" }}>
                <Text style={{ color: C.accentAlt, fontSize: 11, fontWeight: "700" }}>Compact mode on</Text>
              </View>
            ) : null}
            {settings.hideSolvedQuestions ? (
              <View style={{ backgroundColor: C.sunDim, borderRadius: R.full, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: C.sun + "30" }}>
                <Text style={{ color: C.sun, fontSize: 11, fontWeight: "700" }}>Hiding solved feed</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={{ flexDirection: "row", marginHorizontal: S.lg, gap: 10, marginBottom: S.lg }}>
          <StatCard label="Questions" value={profile?.questions ?? 0} color={C.accent} bg={C.accentDim} icon="document-text-outline" />
          <StatCard label="Answers" value={profile?.answers ?? 0} color={C.accentAlt} bg={C.accentAltDim} icon="chatbubble-ellipses-outline" />
          <StatCard label="Saved" value={saved.length} color={C.sun} bg={C.sunDim} icon="bookmark-outline" />
        </View>

        <View style={{ marginHorizontal: S.lg, backgroundColor: C.bg2, borderRadius: 22, borderWidth: 1, borderColor: C.border, overflow: "hidden", marginBottom: S.lg, shadowColor: "#020817", shadowOpacity: 0.18, shadowOffset: { width: 0, height: 10 }, shadowRadius: 16, elevation: 3 }}>
          {MENU.map((item, i) => (
            <PressableScale key={item.label} onPress={item.onPress} activeScale={0.985} style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: S.lg, paddingVertical: S.md + 4, borderBottomWidth: i < MENU.length - 1 ? 1 : 0, borderBottomColor: C.border }}>
              <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: item.tone, alignItems: "center", justifyContent: "center", marginRight: S.md }}>
                <Ionicons name={item.icon as any} size={18} color={item.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.t1, fontSize: 14, fontWeight: "700" }}>{item.label}</Text>
                <Text style={{ color: C.t3, fontSize: 12, marginTop: 2 }}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={C.t3} />
            </PressableScale>
          ))}
        </View>

        <View style={{ marginHorizontal: S.lg }}>
          <PressableScale onPress={logout} activeScale={0.97} style={{ backgroundColor: C.redDim, borderWidth: 1.5, borderColor: C.red + "30", borderRadius: R.md, paddingVertical: 15, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}>
            <Ionicons name="log-out-outline" size={16} color={C.red} />
            <Text style={{ color: C.red, fontWeight: "800", fontSize: 15 }}>Log Out</Text>
          </PressableScale>
        </View>
      </ScrollView>
    </View>
  );
}
