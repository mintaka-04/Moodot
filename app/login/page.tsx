"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, LogIn, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getCurrentUser, signInWithGoogle } from "@/lib/supabase/auth"
import type { User } from "@supabase/supabase-js"

export default function LoginPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  const isSignedIn = Boolean(user && !user.is_anonymous)
  const displayName = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "사용자"

  return (
    <main className="min-h-screen bg-gradient-to-b from-mb-bg via-white to-mb-accent/10 text-mb-dark">
      <div className="mx-auto flex min-h-screen max-w-[375px] flex-col px-5 py-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-mb-card/80 text-mb-muted hover:bg-mb-unselected"
            asChild
          >
            <Link href="/" aria-label="홈으로 돌아가기">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="text-sm font-medium text-mb-muted">로그인</span>
          <div className="h-9 w-9" />
        </div>

        <section className="flex flex-1 flex-col justify-center gap-8 py-8">
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-mb-accent via-mb-accent-mint to-mb-accent-cyan/80 shadow-[0_12px_30px_rgba(150,200,220,0.25)]">
              <Image
                src="/images/moodot-logo.png"
                alt="Moodot"
                width={72}
                height={72}
                className="h-14 w-auto"
                priority
              />
            </div>
            <div className="space-y-2">
              <p className="font-heading text-2xl font-semibold tracking-tight text-mb-dark">
                Moodot에 로그인하기
              </p>
              <p className="text-sm leading-6 text-mb-muted">
                감정 기록과 캘린더를 내 계정 기준으로 편하게 이어서 확인할 수 있어요.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-mb-unselected/60 bg-white/90 p-5 shadow-[0_20px_50px_rgba(150,200,220,0.16)] backdrop-blur">
            {user === undefined ? (
              <div className="space-y-3">
                <div className="h-5 w-28 animate-pulse rounded-full bg-mb-card" />
                <div className="h-11 animate-pulse rounded-2xl bg-mb-card" />
                <div className="h-4 w-full animate-pulse rounded-full bg-mb-card/70" />
              </div>
            ) : isSignedIn ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-2xl bg-mb-accent/15 px-4 py-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-mb-primary shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 text-left">
                    <p className="text-sm font-semibold text-mb-dark">
                      {displayName}님, 이미 로그인되어 있어요
                    </p>
                    <p className="text-xs leading-5 text-mb-muted">
                      홈으로 돌아가서 기록 작성이나 캘린더 확인을 바로 이어갈 수 있습니다.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => router.push("/")}
                  className="h-11 w-full rounded-2xl bg-mb-primary text-white hover:bg-mb-primary-dark"
                >
                  홈으로 돌아가기
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1 text-left">
                  <p className="text-sm font-semibold text-mb-dark">구글 계정으로 시작하기</p>
                  <p className="text-xs leading-5 text-mb-muted">
                    기록과 캘린더를 계정에 연결해두면 다른 기기에서도 같은 흐름으로 확인할 수 있어요.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      setIsLoading(true)
                      await signInWithGoogle()
                    } catch {
                      alert("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.")
                      setIsLoading(false)
                    }
                  }}
                  disabled={isLoading}
                  className="h-11 w-full rounded-2xl bg-mb-dark text-white hover:bg-mb-dark/90"
                >
                  <LogIn className="h-4 w-4" />
                  {isLoading ? "구글 로그인 연결 중..." : "Google로 계속하기"}
                </Button>

                <p className="text-xs leading-5 text-mb-muted">
                  로그인하지 않아도 일부 기능은 사용할 수 있지만, 계정 연결 시 기록을 더 안정적으로 이어서 관리할 수 있어요.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
