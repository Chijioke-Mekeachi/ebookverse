// src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

// Your Supabase configuration
const SUPABASE_URL = 'https://suqtujkpvhkvxywbdubt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cXR1amtwdmhrdnh5d2JkdWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzEzNTUsImV4cCI6MjA3ODEwNzM1NX0.BrZL_jBoLA2zBdA5EFRAsN-byLAScXijmmdAp6cG0UA';

// Initialize Supabase client with proper error handling
let supabase;

try {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase configuration');
  }

  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Fallback to a mock client or handle the error appropriately
  supabase = {
    auth: {
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Supabase not configured') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      update: () => ({
        eq: () => ({
          select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
        })
      })
    })
  };
}

export { supabase };