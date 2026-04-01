"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type MemoryRow = {
  id: number
  title: string | null
  text: string | null
  emotion_id: number | null
  memory_at: string | null
}

const EMOTION_COLOR_MAP: Record<number, string> = {
  1: "#FFE8B8",
  2: "#F8C8C8",
  3: "#B0E4F8",
  4: "#C0ECD8",
}

function formatMemoryDate(value: string | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

interface ReflectionCardProps {
  color: string
  label: string
  text: string
  variant: "primary" | "secondary"
  onClick?: () => void
}

function ReflectionCard({ color, label, text, variant, onClick }: ReflectionCardProps) {
  const isPrimary = variant === "primary"

  return (
    <div
      onClick={onClick}
      className={
        (isPrimary
          ? "bg-mb-card rounded-xl p-4 shadow-sm shadow-mb-dark/5"
          : "bg-white/60 rounded-xl p-4 border border-mb-unselected") +
        (onClick ? " cursor-pointer transition-all duration-200 hover:-translate-y-0.5" : "")
      }
    >
      <div className="flex items-center mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-[10px] uppercase tracking-wider text-mb-muted font-body font-medium">
            {label}
          </span>
        </div>
      </div>
      <p
        className={`font-body text-sm leading-relaxed ${
          isPrimary ? "text-mb-dark" : "text-mb-muted"
        }`}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text}
      </p>
    </div>
  )
}

export function RecentReflections() {
  const [memories, setMemories] = useState<MemoryRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const fetchMemories = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data } = await supabase
          .from("memories")
          .select("id,title,text,emotion_id,memory_at")
          .order("memory_at", { ascending: false })
          .limit(2)

        if (!mounted) return
        setMemories((data as MemoryRow[]) ?? [])
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    void fetchMemories()
    return () => { mounted = false }
  }, [])

  return (
    <section className="pt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-base text-mb-dark">
          최근 기록
        </h3>
        <Button
          variant="ghost"
          className="h-auto p-0 text-xs text-mb-primary hover:text-mb-primary-dark hover:bg-transparent font-body font-medium"
          onClick={() => router.push("/records")}
        >
          전체보기
        </Button>
      </div>

      {isLoading ? (
        <p className="py-4 text-center text-sm text-mb-muted">불러오는 중...</p>
      ) : memories.length === 0 ? (
        <p className="py-4 text-center text-sm text-mb-muted">기록이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {memories.map((memory, index) => {
            const color = EMOTION_COLOR_MAP[memory.emotion_id ?? 1] ?? EMOTION_COLOR_MAP[1]
            const label = formatMemoryDate(memory.memory_at)
            const text = memory.text?.trim() || memory.title?.trim() || "내용 없음"

            return (
              <ReflectionCard
                key={memory.id}
                color={color}
                label={label}
                text={text}
                variant={index === 0 ? "primary" : "secondary"}
                onClick={() => router.push(`/memory/${memory.id}`)}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
