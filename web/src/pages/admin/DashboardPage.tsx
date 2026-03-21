import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader"
import { DashboardStatsGrid } from "@/components/admin/dashboard/DashboardStatsGrid"
import { MemberGrowthCard } from "@/components/admin/dashboard/MemberGrowthCard"
import { RecentActivityCard } from "@/components/admin/dashboard/RecentActivityCard"
import {
  containerAnimation,
  itemAnimation,
  recentActivity,
  stats
} from "@/components/admin/dashboard/dashboardData"

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      <DashboardHeader />

      <DashboardStatsGrid
        stats={stats}
        containerAnimation={containerAnimation}
        itemAnimation={itemAnimation}
      />

      <div className="grid gap-8 lg:grid-cols-7">
        <MemberGrowthCard itemAnimation={itemAnimation} />
        <RecentActivityCard itemAnimation={itemAnimation} recentActivity={recentActivity} />
      </div>
    </div>
  )
}
