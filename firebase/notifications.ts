import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";
import { currentUser } from "./auth";
import type { Notification } from "../components/types";

function formatNotificationDate(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    typeof (value as { seconds?: unknown }).seconds === "number"
  ) {
    const seconds = (value as { seconds: number }).seconds;
    return new Date(seconds * 1000).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return "Just now";
}

export async function createNotification(data: Omit<Notification, "id" | "read" | "createdAt">): Promise<void> {
  await addDoc(collection(db, "notifications"), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToNotifications(
  callback: (notifs: Notification[]) => void,
): Unsubscribe {
  const user = currentUser();
  if (!user) return () => {};
  const q = query(
    collection(db, "notifications"),
    where("toUserId", "==", user.uid),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(q, snap => {
    callback(
      snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: formatNotificationDate(data.createdAt),
        } as Notification;
      }),
    );
  });
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, "notifications", id), { read: true });
}

export async function markAllNotificationsRead(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach(id => batch.update(doc(db, "notifications", id), { read: true }));
  await batch.commit();
}
