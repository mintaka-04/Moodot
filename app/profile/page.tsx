"use client"

import Link from "next/link"
import { ArrowLeft, Info, LogOut, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser, signOut } from "@/lib/supabase/auth"
import type { User } from "@supabase/supabase-js"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  const isSignedIn = Boolean(user && !user.is_anonymous)
  const displayName = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "게스트"
  const avatarFallback = displayName.charAt(0).toUpperCase() || "G"

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
          <span className="text-sm font-medium text-mb-muted">프로필 및 설정</span>
          <div className="h-9 w-9" />
        </div>

        <section className="flex flex-1 flex-col gap-5 py-8">
          <div className="rounded-[28px] border border-mb-unselected/60 bg-white/90 p-5 shadow-[0_20px_50px_rgba(150,200,220,0.16)] backdrop-blur">
            {user === undefined ? (
              <div className="space-y-3">
                <div className="h-14 w-14 animate-pulse rounded-full bg-mb-card" />
                <div className="h-5 w-24 animate-pulse rounded-full bg-mb-card" />
                <div className="h-4 w-40 animate-pulse rounded-full bg-mb-card/70" />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-mb-accent-mint/40">
                  <AvatarImage src={user?.user_metadata?.avatar_url ?? ""} alt={displayName} />
                  <AvatarFallback className="bg-gradient-to-b from-mb-accent via-mb-accent-mint to-mb-accent-cyan text-mb-dark font-heading font-semibold">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-mb-dark">{displayName}</p>
                  <p className="text-sm text-mb-muted">
                    {isSignedIn ? user?.email ?? "구글 계정으로 연결됨" : "아직 로그인하지 않았어요"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-mb-unselected/60 bg-white/90 p-5 shadow-[0_20px_50px_rgba(150,200,220,0.16)] backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mb-accent/15 text-mb-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-mb-dark">계정 상태</p>
                <p className="text-xs leading-5 text-mb-muted">
                  {isSignedIn
                    ? "현재 계정에 기록과 캘린더가 연결되어 있어요."
                    : "로그인하면 기록을 계정 기준으로 더 안정적으로 관리할 수 있어요."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-mb-unselected/60 bg-white/90 p-5 shadow-[0_20px_50px_rgba(150,200,220,0.16)] backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mb-accent/15 text-mb-primary">
                <Info className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-mb-dark">앱 정보</p>
                <p className="text-xs leading-5 text-mb-muted">
                  Moodot 1.1 · 설정 기능은 MVP 이후에 차근차근 확장될 예정이에요.
                </p>
              </div>
            </div>
          </div>

          {isSignedIn ? (
            <Button
              type="button"
              onClick={async () => {
                try {
                  setIsSigningOut(true)
                  await signOut()
                  router.push("/login")
                  router.refresh()
                } catch {
                  alert("로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.")
                  setIsSigningOut(false)
                }
              }}
              disabled={isSigningOut}
              className="mt-auto h-11 w-full rounded-2xl bg-mb-dark text-white hover:bg-mb-dark/90"
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? "로그아웃 중..." : "로그아웃"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-auto h-11 w-full rounded-2xl bg-mb-primary text-white hover:bg-mb-primary-dark"
            >
              로그인하러 가기
            </Button>
          )}
        </section>
      </div>
    </main>
  )
}
