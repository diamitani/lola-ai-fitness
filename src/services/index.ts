/**
 * Unified backend service interface
 * Exports functions that use either Firebase or Supabase based on VITE_BACKEND_PROVIDER
 */

import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User as FirebaseUser } from 'firebase/auth';
import type { Profile, Plan } from '../types';

export type User = FirebaseUser | SupabaseUser | null;

const BACKEND_PROVIDER = import.meta.env.VITE_BACKEND_PROVIDER || 'firebase';

// We'll lazy load the backend module
let backendModule: any = null;
let backendPromise: Promise<any> | null = null;

async function loadBackendModule() {
  if (backendModule) return backendModule;
  if (backendPromise) return backendPromise;
  
  backendPromise = (async () => {
    if (BACKEND_PROVIDER === 'supabase') {
      const supabaseModule = await import('./supabase');
      backendModule = {
        signUpWithEmail: supabaseModule.signUpWithEmail,
        signInWithEmail: supabaseModule.signInWithEmail,
        signInWithGoogle: supabaseModule.signInWithGoogle,
        signOutUser: supabaseModule.signOutUser,
        getUserProfile: supabaseModule.getUserProfile,
        updateUserProfile: supabaseModule.updateUserProfile,
        updateUserPlan: supabaseModule.updateUserPlan,
        onAuthStateChanged: supabaseModule.onAuthStateChanged,
        upsertUserProfile: supabaseModule.upsertUserProfile,
        getCurrentUser: supabaseModule.getCurrentUser,
      };
    } else {
      const firebaseModule = await import('./firebase');
      backendModule = {
        signUpWithEmail: firebaseModule.signUpWithEmail,
        signInWithEmail: firebaseModule.signInWithEmail,
        signInWithGoogle: firebaseModule.signInWithGoogle,
        signOutUser: firebaseModule.signOutUser,
        getUserProfile: firebaseModule.getUserProfile,
        updateUserProfile: firebaseModule.updateUserProfile,
        updateUserPlan: firebaseModule.updateUserPlan,
        onAuthStateChanged: firebaseModule.onAuthStateChanged,
        upsertUserProfile: async (_user: SupabaseUser) => {
          console.warn('upsertUserProfile not implemented for Firebase');
        },
        getCurrentUser: async () => {
          return firebaseModule.auth.currentUser;
        },
      };
    }
    return backendModule;
  })();
  
  return backendPromise;
}

// Helper to get backend module, ensures it's loaded
async function getBackend() {
  if (!backendModule && !backendPromise) {
    await loadBackendModule();
  }
  return backendModule || (await backendPromise);
}

// Auth functions
export async function signUpWithEmail(email: string, password: string, name: string) {
  const backend = await getBackend();
  return backend.signUpWithEmail(email, password, name);
}

export async function signInWithEmail(email: string, password: string) {
  const backend = await getBackend();
  return backend.signInWithEmail(email, password);
}

export async function signInWithGoogle() {
  const backend = await getBackend();
  return backend.signInWithGoogle();
}

export async function signOutUser() {
  const backend = await getBackend();
  return backend.signOutUser();
}

// Data functions
export async function getUserProfile(uid: string) {
  const backend = await getBackend();
  return backend.getUserProfile(uid);
}

export async function updateUserProfile(uid: string, profile: Profile) {
  const backend = await getBackend();
  return backend.updateUserProfile(uid, profile);
}

export async function updateUserPlan(uid: string, plan: Plan) {
  const backend = await getBackend();
  return backend.updateUserPlan(uid, plan);
}

// Auth state listener - special handling because it needs to work synchronously
// We'll initialize the backend immediately and set up the listener
let unsubscribe: (() => void) | null = null;

// Initialize backend and set up auth state listener
export function onAuthStateChanged(callback: (user: User) => void) {
  // Load backend and set up listener
  loadBackendModule().then(backend => {
    if (unsubscribe) unsubscribe();
    unsubscribe = backend.onAuthStateChanged(callback);
  }).catch(console.error);
  
  // Return unsubscribe function
  return () => {
    if (unsubscribe) unsubscribe();
    unsubscribe = null;
  };
}

// Optional functions
export async function upsertUserProfile(user: SupabaseUser) {
  const backend = await getBackend();
  if (backend.upsertUserProfile) {
    return backend.upsertUserProfile(user);
  }
  return Promise.resolve();
}

export async function getCurrentUser() {
  const backend = await getBackend();
  if (backend.getCurrentUser) {
    return backend.getCurrentUser();
  }
  return null;
}

// Helper to get user ID regardless of backend
export function getUserId(user: User): string {
  if (!user) return '';
  // Firebase User has `uid`, Supabase User has `id`
  return (user as any).uid || (user as any).id || '';
}

// Utility
export function getBackendProvider() {
  return BACKEND_PROVIDER;
}