// ─── firebase/questions.ts ────────────────────────────────────────────────
import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, where, limit, serverTimestamp, increment,
  onSnapshot, type Unsubscribe, Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { currentUser } from "./auth";
import type { Question, Answer } from "../components/types";

// ── Helpers ───────────────────────────────────────────────────────────────
const qCol = () => collection(db, "questions");
const aCol = (qId: string) => collection(db, "questions", qId, "answers");

function tsToString(ts: any): string {
  if (!ts) return "Just now";
  if (ts instanceof Timestamp) {
    const d = ts.toDate();
    const diff = Date.now() - d.getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)   return "Just now";
    if (mins  < 60)  return `${mins}m ago`;
    if (hours < 24)  return `${hours}h ago`;
    return `${days}d ago`;
  }
  return String(ts);
}

function mapQuestion(id: string, data: any, answersList: Answer[] = []): Question {
  return {
    id,
    title:      data.title      ?? "",
    body:       data.body       ?? "",
    subject:    data.subject    ?? "",
    tags:       data.tags       ?? [],
    authorId:   data.authorId   ?? "",
    authorName: data.authorName ?? "Anonymous",
    college:    data.college    ?? "",
    votes:      data.votes      ?? 0,
    answers:    data.answers    ?? 0,
    answersList,
    createdAt:  tsToString(data.createdAt),
    updatedAt:  tsToString(data.updatedAt),
  };
}

function mapAnswer(id: string, data: any): Answer {
  return {
    id,
    body:       data.body       ?? "",
    authorId:   data.authorId   ?? "",
    authorName: data.authorName ?? "Anonymous",
    college:    data.college    ?? "",
    votes:      data.votes      ?? 0,
    isAccepted: data.isAccepted ?? false,
    createdAt:  tsToString(data.createdAt),
  };
}

// ── Post a question ───────────────────────────────────────────────────────
export async function postQuestion(payload: {
  title: string;
  body: string;
  subject: string;
  tags: string[];
  college: string;
}): Promise<string> {
  const user = currentUser();
  if (!user) throw new Error("Not authenticated");
  const ref = await addDoc(qCol(), {
    title:      payload.title.trim(),
    body:       payload.body.trim(),
    subject:    payload.subject,
    tags:       payload.tags,
    college:    payload.college,
    authorId:   user.uid,
    authorName: user.displayName ?? "Anonymous",
    votes:      0,
    answers:    0,
    createdAt:  serverTimestamp(),
    updatedAt:  serverTimestamp(),
  });
  await updateDoc(doc(db, "users", user.uid), { questions: increment(1) });
  return ref.id;
}

// ── Fetch feed (newest first) ─────────────────────────────────────────────
export async function fetchQuestions(pageLimit = 30): Promise<Question[]> {
  const snap = await getDocs(
    query(qCol(), orderBy("createdAt", "desc"), limit(pageLimit))
  );
  return snap.docs.map(d => mapQuestion(d.id, d.data()));
}

// ── Fetch by subject ──────────────────────────────────────────────────────
export async function fetchQuestionsBySubject(
  subject: string,
  pageLimit = 30,
): Promise<Question[]> {
  const snap = await getDocs(
    query(qCol(), where("subject", "==", subject), orderBy("createdAt", "desc"), limit(pageLimit))
  );
  return snap.docs.map(d => mapQuestion(d.id, d.data()));
}

// ── Fetch current user's questions ────────────────────────────────────────
export async function fetchMyQuestions(): Promise<Question[]> {
  const user = currentUser();
  if (!user) return [];
  const snap = await getDocs(
    query(qCol(), where("authorId", "==", user.uid), orderBy("createdAt", "desc"))
  );
  return snap.docs.map(d => mapQuestion(d.id, d.data()));
}

// ── Fetch single question + all answers ───────────────────────────────────
export async function fetchQuestionById(id: string): Promise<Question | null> {
  const qSnap = await getDoc(doc(db, "questions", id));
  if (!qSnap.exists()) return null;
  const aSnap = await getDocs(query(aCol(id), orderBy("createdAt", "asc")));
  const answersList = aSnap.docs.map(d => mapAnswer(d.id, d.data()));
  return mapQuestion(id, qSnap.data(), answersList);
}

// ── Real-time listener on a single question (answers included) ────────────
export function subscribeToQuestion(
  id: string,
  callback: (q: Question) => void,
): Unsubscribe {
  return onSnapshot(doc(db, "questions", id), async qSnap => {
    if (!qSnap.exists()) return;
    const aSnap = await getDocs(query(aCol(id), orderBy("createdAt", "asc")));
    const answersList = aSnap.docs.map(d => mapAnswer(d.id, d.data()));
    callback(mapQuestion(id, qSnap.data(), answersList));
  });
}

// ── Vote on a question (direction: +1 or -1) ──────────────────────────────
export async function voteQuestion(
  questionId: string,
  direction: 1 | -1,
): Promise<void> {
  await updateDoc(doc(db, "questions", questionId), { votes: increment(direction) });
}

// ── Post an answer ────────────────────────────────────────────────────────
export async function postAnswer(
  questionId: string,
  body: string,
  college: string,
): Promise<string> {
  const user = currentUser();
  if (!user) throw new Error("Not authenticated");
  const ref = await addDoc(aCol(questionId), {
    body:       body.trim(),
    authorId:   user.uid,
    authorName: user.displayName ?? "Anonymous",
    college,
    votes:      0,
    isAccepted: false,
    createdAt:  serverTimestamp(),
  });
  await updateDoc(doc(db, "questions", questionId), {
    answers:   increment(1),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "users", user.uid), { answers: increment(1) });
  return ref.id;
}

// ── Vote on an answer ─────────────────────────────────────────────────────
export async function voteAnswer(
  questionId: string,
  answerId: string,
  direction: 1 | -1,
): Promise<void> {
  await updateDoc(
    doc(db, "questions", questionId, "answers", answerId),
    { votes: increment(direction) },
  );
}

// ── Accept an answer ──────────────────────────────────────────────────────
export async function acceptAnswer(
  questionId: string,
  answerId: string,
): Promise<void> {
  const snap = await getDocs(aCol(questionId));
  await Promise.all(
    snap.docs
      .filter(d => d.data().isAccepted)
      .map(d => updateDoc(d.ref, { isAccepted: false })),
  );
  await updateDoc(doc(db, "questions", questionId, "answers", answerId), {
    isAccepted: true,
  });
}

// ── Delete a question ─────────────────────────────────────────────────────
export async function deleteQuestion(id: string): Promise<void> {
  const user = currentUser();
  if (!user) throw new Error("Not authenticated");
  await deleteDoc(doc(db, "questions", id));
  await updateDoc(doc(db, "users", user.uid), { questions: increment(-1) });
}
