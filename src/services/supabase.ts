import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Using Firebase instead.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Types
interface UserProfile {
  uid: string;
  email: string;
  name: string;
  createdAt: string;
  profile: any;
  plan: any;
}

// Authentication functions
export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  
  if (error) throw error;
  if (!data.user) throw new Error('No user returned');
  
  // Create user profile in database
  const { error: profileError } = await supabase
    .from('users')
    .insert({
      uid: data.user.id,
      email,
      name,
      createdAt: new Date().toISOString(),
      profile: null,
      plan: null,
    });
    
  if (profileError) {
    console.error('Failed to create user profile:', profileError);
    // User is created in auth but profile failed - still return user
  }
  
  return data.user;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data.user;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/app`,
    },
  });
  
  if (error) throw error;
  // Note: OAuth redirects away, so this function may not return
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUserProfile(uid: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('uid', uid)
    .single();
    
  if (error) {
    // User profile might not exist yet (for OAuth users)
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  
  return data as UserProfile;
}

export async function updateUserProfile(uid: string, profile: any) {
  const { data, error } = await supabase
    .from('users')
    .update({ profile })
    .eq('uid', uid);
    
  if (error) throw error;
  return data;
}

export async function updateUserPlan(uid: string, plan: any) {
  const { data, error } = await supabase
    .from('users')
    .update({ plan })
    .eq('uid', uid);
    
  if (error) throw error;
  return data;
}

export async function upsertUserProfile(user: User) {
  // Check if profile exists
  const existing = await getUserProfile(user.id);
  
  if (!existing) {
    // Create new profile
    const { error } = await supabase
      .from('users')
      .insert({
        uid: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        createdAt: new Date().toISOString(),
        profile: null,
        plan: null,
      });
      
    if (error) throw error;
  }
}

// Auth state change listener
export function onAuthStateChanged(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
}

// Helper to get current session
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}