import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  doc, setDoc, getDoc, updateDoc, serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./config";
import type { UserProfile } from "../components/types";

export async function registerUser(
  email: string,
  password: string,
  name: string,
  college: string,
  department: string,
): Promise<FirebaseUser> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  // 🔥 ADD THIS LINE
  await sendEmailVerification(user);

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    college: college.trim(),
    department: department.trim(),
    questions: 0,
    answers: 0,
    votes: 0,
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<FirebaseUser> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function sendVerificationEmailToUser(user?: FirebaseUser | null): Promise<void> {
  const target = user ?? auth.currentUser;
  if (!target) throw new Error("No signed-in user found.");
  await sendEmailVerification(target);
}

export async function reloadAuthUser(user?: FirebaseUser | null): Promise<FirebaseUser | null> {
  const target = user ?? auth.currentUser;
  if (!target) return null;
  await target.reload();
  return auth.currentUser ?? target;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, "name" | "college" | "department">>,
): Promise<void> {
  await updateDoc(doc(db, "users", uid), data);
  if (data.name && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: data.name });
  }
}

export function currentUser(): FirebaseUser | null {
  return auth.currentUser;
}

export function onAuthChange(
  callback: (user: FirebaseUser | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}
