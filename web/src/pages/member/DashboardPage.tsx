import { DashboardHeader } from "./components/DashboardHeader"
import { MembershipStatus } from "./components/MembershipStatus"
import { NextClass } from "./components/NextClass"
import { QuickProfile } from "./components/QuickProfile"
import { QuickStatsGrid } from "./components/QuickStatsGrid"
import { RecentProgress } from "./components/RecentProgress"
import {
  containerAnimation,
  itemAnimation,
  quickStats
} from "./components/dashboardData"

export default function MemberDashboardPage() {
  return (
    <div className="space-y-8 pb-10 text-slate-900 dark:text-white">
      <DashboardHeader />

      <QuickStatsGrid
        quickStats={quickStats}
        containerAnimation={containerAnimation}
        itemAnimation={itemAnimation}
      />

      <div className="grid gap-8 lg:grid-cols-7">
        <div className="space-y-8 lg:col-span-4">
          <NextClass />
          <RecentProgress />
        </div>

        <div className="space-y-8 lg:col-span-3">
          <MembershipStatus />
          <QuickProfile />
        </div>
      </div>
    </div>
  )
}
