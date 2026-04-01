import { getSupabaseBrowserClient } from "@/lib/supabase/client"

// ---------- Types ----------

export type MemoryRow = {
  id: number
  title: string | null
  text: string | null
  image_url: string | null
  emotion_id: number | null
  with_whom: string | null
  memory_at: string | null
  place_name: string | null
  location_label: string | null
  location_lat: number | null
  location_lng: number | null
}

export type CreateMemoryInput = {
  title: string | null
  text: string | null
  image_url: string | null
  emotion_id: number
  with_whom: string
  memory_at: string
  location_lat: number | null
  location_lng: number | null
  location_label: string | null
  place_name: string | null
}

export type UpdateMemoryInput = {
  title: string | null
  text: string | null
  image_url: string | null
  emotion_id: number
  with_whom: string
  memory_at: string
  location_lat: number | null
  location_lng: number | null
  location_label: string | null
  place_name: string | null
}

// ---------- Queries ----------

/** 전체 목록 (memory_at 내림차순). 에러 시 throw. */
export async function getMemories(): Promise<MemoryRow[]> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("memories")
    .select("id,title,text,emotion_id,with_whom,memory_at")
    .order("memory_at", { ascending: false })
  if (error) throw error
  return (data as MemoryRow[]) ?? []
}

/** 최신 N개 (memory_at 내림차순). 에러 시 throw. */
export async function getRecentMemories(limit: number): Promise<MemoryRow[]> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("memories")
    .select("id,title,text,emotion_id,memory_at")
    .order("memory_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as MemoryRow[]) ?? []
}

/** 단건 조회. 에러 시 throw. */
export async function getMemoryById(id: number): Promise<MemoryRow> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("memories")
    .select("id,title,text,image_url,emotion_id,with_whom,memory_at,place_name,location_label,location_lat,location_lng")
    .eq("id", id)
    .single()
  if (error) throw error
  return data as MemoryRow
}

// ---------- Mutations ----------

/** 새 메모리 생성. 에러 시 throw. */
export async function createMemory(input: CreateMemoryInput): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from("memories").insert(input)
  if (error) throw error
}

/** 기존 메모리 수정. 에러 시 throw. */
export async function updateMemory(id: number, input: UpdateMemoryInput): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from("memories").update(input).eq("id", id)
  if (error) throw error
}

/** 메모리 삭제. 에러 시 throw. */
export async function deleteMemory(id: number): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from("memories").delete().eq("id", id)
  if (error) throw error
}
