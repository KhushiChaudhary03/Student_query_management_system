import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppSettings = {
  pushEnabled: boolean;
  compactMode: boolean;
  hideSolvedQuestions: boolean;
};

const STORAGE_KEY = "campusquery.app-settings";

export const DEFAULT_SETTINGS: AppSettings = {
  pushEnabled: true,
  compactMode: false,
  hideSolvedQuestions: false,
};

const listeners = new Set<(settings: AppSettings) => void>();

function normalizeSettings(value: Partial<AppSettings> | null | undefined): AppSettings {
  return {
    pushEnabled: value?.pushEnabled ?? DEFAULT_SETTINGS.pushEnabled,
    compactMode: value?.compactMode ?? DEFAULT_SETTINGS.compactMode,
    hideSolvedQuestions: value?.hideSolvedQuestions ?? DEFAULT_SETTINGS.hideSolvedQuestions,
  };
}

export async function getAppSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return normalizeSettings(JSON.parse(raw) as Partial<AppSettings>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  const normalized = normalizeSettings(settings);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  listeners.forEach(listener => listener(normalized));
}

export function subscribeToAppSettings(listener: (settings: AppSettings) => void): () => void {
  listeners.add(listener);
  getAppSettings().then(listener).catch(() => listener(DEFAULT_SETTINGS));
  return () => {
    listeners.delete(listener);
  };
}
