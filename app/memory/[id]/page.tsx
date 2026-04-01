import { TopAppBar } from "@/components/moodot/top-app-bar"
import { BottomNavigation } from "@/components/moodot/bottom-navigation"
import { MemoryDetail } from "@/components/moodot/memory-detail"

export default async function MemoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-mb-bg relative">
      <TopAppBar />
      <main className="relative mx-auto max-w-[375px] px-5 pt-20 pb-32">
        <MemoryDetail id={Number(id)} />
      </main>
      <BottomNavigation />
    </div>
  )
}
