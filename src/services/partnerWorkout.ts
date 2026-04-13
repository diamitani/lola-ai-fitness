import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export interface WorkoutSession {
  id: string;
  hostUid: string;
  hostName: string;
  partnerUid?: string;
  partnerName?: string;
  status: 'waiting' | 'active' | 'completed';
  workoutType: string;
  createdAt: any;
  startedAt?: any;
  completedAt?: any;
}

export interface SessionMessage {
  uid: string;
  name: string;
  message: string;
  timestamp: any;
}

/**
 * Create a new workout session
 */
export async function createWorkoutSession(
  uid: string,
  name: string,
  workoutType: string
): Promise<string> {
  const sessionId = `session_${Date.now()}_${uid.slice(0, 8)}`;
  const sessionRef = doc(db, 'workoutSessions', sessionId);

  await setDoc(sessionRef, {
    id: sessionId,
    hostUid: uid,
    hostName: name,
    status: 'waiting',
    workoutType,
    createdAt: serverTimestamp(),
  });

  return sessionId;
}

/**
 * Get all available workout sessions
 */
export async function getAvailableSessions(): Promise<WorkoutSession[]> {
  const sessionsRef = collection(db, 'workoutSessions');
  const q = query(sessionsRef, where('status', '==', 'waiting'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => doc.data() as WorkoutSession);
}

/**
 * Join an existing workout session
 */
export async function joinWorkoutSession(
  sessionId: string,
  uid: string,
  name: string
): Promise<void> {
  const sessionRef = doc(db, 'workoutSessions', sessionId);
  await updateDoc(sessionRef, {
    partnerUid: uid,
    partnerName: name,
    status: 'active',
    startedAt: serverTimestamp(),
  });
}

/**
 * Leave a workout session
 */
export async function leaveWorkoutSession(
  sessionId: string,
  uid: string
): Promise<void> {
  const sessionRef = doc(db, 'workoutSessions', sessionId);
  const sessionSnap = await getDoc(sessionRef);

  if (!sessionSnap.exists()) return;

  const session = sessionSnap.data() as WorkoutSession;

  // If host leaves, delete session
  if (session.hostUid === uid) {
    await deleteDoc(sessionRef);
  } else {
    // Partner leaves, reset to waiting
    await updateDoc(sessionRef, {
      partnerUid: null,
      partnerName: null,
      status: 'waiting',
    });
  }
}

/**
 * Complete a workout session
 */
export async function completeWorkoutSession(sessionId: string): Promise<void> {
  const sessionRef = doc(db, 'workoutSessions', sessionId);
  await updateDoc(sessionRef, {
    status: 'completed',
    completedAt: serverTimestamp(),
  });
}

/**
 * Subscribe to session updates
 */
export function subscribeToSession(
  sessionId: string,
  callback: (session: WorkoutSession | null) => void
): () => void {
  const sessionRef = doc(db, 'workoutSessions', sessionId);

  return onSnapshot(sessionRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as WorkoutSession);
    } else {
      callback(null);
    }
  });
}

/**
 * Send a message in the session
 */
export async function sendSessionMessage(
  sessionId: string,
  uid: string,
  name: string,
  message: string
): Promise<void> {
  const messageRef = doc(collection(db, 'workoutSessions', sessionId, 'messages'));
  await setDoc(messageRef, {
    uid,
    name,
    message,
    timestamp: serverTimestamp(),
  });
}

/**
 * Subscribe to session messages
 */
export function subscribeToSessionMessages(
  sessionId: string,
  callback: (messages: SessionMessage[]) => void
): () => void {
  const messagesRef = collection(db, 'workoutSessions', sessionId, 'messages');

  return onSnapshot(messagesRef, (snapshot) => {
    const messages = snapshot.docs
      .map(doc => doc.data() as SessionMessage)
      .sort((a, b) => {
        const aTime = a.timestamp instanceof Timestamp ? a.timestamp.toMillis() : 0;
        const bTime = b.timestamp instanceof Timestamp ? b.timestamp.toMillis() : 0;
        return aTime - bTime;
      });
    callback(messages);
  });
}
