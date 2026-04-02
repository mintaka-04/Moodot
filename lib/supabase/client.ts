import { createClient } from "@supabase/supabase-js"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseClient: ReturnType<typeof createClient<any>> | null = null

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are missing.")
  }

  supabaseClient = createClient<any>(url, anonKey) // eslint-disable-line @typescript-eslint/no-explicit-any
  return supabaseClient
}

export function getSupabaseBrowserClient() {
  return getSupabaseClient()
}
