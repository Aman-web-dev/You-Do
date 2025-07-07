import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  // Ensure environment variables are defined
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(url, anonKey);
}