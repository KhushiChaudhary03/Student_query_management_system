import AsyncStorage from "@react-native-async-storage/async-storage";
import { Question } from "../components/types";

export type SavedQuestion = Pick<
  Question,
  "id" | "title" | "subject" | "college" | "createdAt" | "answers" | "votes"
>;

const STORAGE_KEY = "campusquery.saved-questions";
const listeners = new Set<(items: SavedQuestion[]) => void>();

function sortSaved(items: SavedQuestion[]): SavedQuestion[] {
  return [...items].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function readSavedQuestions(): Promise<SavedQuestion[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return sortSaved(JSON.parse(raw) as SavedQuestion[]);
  } catch {
    return [];
  }
}

async function writeSavedQuestions(items: SavedQuestion[]): Promise<void> {
  const sorted = sortSaved(items);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  listeners.forEach(listener => listener(sorted));
}

export async function getSavedQuestions(): Promise<SavedQuestion[]> {
  return readSavedQuestions();
}

export async function isQuestionSaved(questionId: string): Promise<boolean> {
  const items = await readSavedQuestions();
  return items.some(item => item.id === questionId);
}

export async function toggleSavedQuestion(question: SavedQuestion): Promise<boolean> {
  const items = await readSavedQuestions();
  const exists = items.some(item => item.id === question.id);
  const next = exists ? items.filter(item => item.id !== question.id) : [...items, question];
  await writeSavedQuestions(next);
  return !exists;
}

export async function removeSavedQuestion(questionId: string): Promise<void> {
  const items = await readSavedQuestions();
  await writeSavedQuestions(items.filter(item => item.id !== questionId));
}

export function subscribeToSavedQuestions(listener: (items: SavedQuestion[]) => void): () => void {
  listeners.add(listener);
  getSavedQuestions().then(listener).catch(() => listener([]));
  return () => {
    listeners.delete(listener);
  };
}
