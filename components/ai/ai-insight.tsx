"use client"

import { useEffect, useState } from "react"
import { Character } from "@/components/ai/character"
import {
  getLatestPendingIntervention,
  markInterventionAsShown,
  type Intervention,
} from "@/lib/services/intervention"
import { getRecentMemories } from "@/lib/services/memory"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type BgScheme = { gradient: string; glow: string; border: string }

const EMOTION_BG: Record<number, BgScheme> = {
  1: { gradient: "linear-gradient(to bottom right, rgba(255,232,184,0.20), rgba(192,236,216,0.10), rgba(255,255,255,1))", glow: "rgba(255,232,184,0.50)", border: "rgba(255,232,184,0.25)" }, // good
  2: { gradient: "linear-gradient(to bottom right, rgba(248,200,200,0.20), rgba(248,200,200,0.10), rgba(255,255,255,1))", glow: "rgba(248,200,200,0.50)", border: "rgba(248,200,200,0.25)" }, // bad
  3: { gradient: "linear-gradient(to bottom right, rgba(176,228,248,0.20), rgba(176,228,248,0.10), rgba(255,255,255,1))", glow: "rgba(176,228,248,0.50)", border: "rgba(176,228,248,0.25)" }, // sad
  4: { gradient: "linear-gradient(to bottom right, rgba(255,232,184,0.20), rgba(192,236,216,0.12), rgba(255,255,255,1))", glow: "rgba(192,236,216,0.50)", border: "rgba(192,236,216,0.25)" }, // calm
}

const DEFAULT_BG: BgScheme = { gradient: "linear-gradient(to bottom right, rgba(180,200,230,0.14), rgba(180,200,230,0.07), rgba(255,255,255,1))", glow: "rgba(180,200,230,0.28)", border: "rgba(180,200,230,0.18)" }

export function AIInsight() {
  const [intervention, setIntervention] = useState<Intervention | null>(null)
  const [latestEmotionId, setLatestEmotionId] = useState<number | null>(null)

  // 초기 로드
  useEffect(() => {
    getLatestPendingIntervention().then((data) => {
      if (data) {
        setIntervention(data)
        markInterventionAsShown(data.id)
      }
    })

    getRecentMemories(1)
      .then((memories) => {
        setLatestEmotionId(memories[0]?.emotion_id ?? null)
      })
      .catch(() => {
        setLatestEmotionId(null)
      })
  }, [])

  // Realtime 구독 — 새 intervention INSERT 시 표시
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    const channel = supabase
      .channel("interventions-insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "interventions" },
        (payload) => {
          const newItem = payload.new as Intervention
          setIntervention(newItem)
          markInterventionAsShown(newItem.id)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const bg = (latestEmotionId != null && EMOTION_BG[latestEmotionId]) ? EMOTION_BG[latestEmotionId] : DEFAULT_BG

  return (
    <section className="pt-8">
      <div
        className="relative overflow-hidden rounded-xl p-5 border transition-colors duration-700"
        style={{ background: bg.gradient, borderColor: bg.border }}
      >
        <div
          className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl transition-colors duration-700"
          style={{ background: bg.glow }}
        />

        <div className="relative flex items-center justify-center h-[120px]">
          <Character emotionId={latestEmotionId} />
        </div>

        {intervention && (
          <p className="relative mt-3 font-body text-sm text-mb-dark leading-relaxed">
            {intervention.message}
          </p>
        )}
      </div>
    </section>
  )
}
