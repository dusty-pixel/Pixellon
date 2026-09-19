import SidebarLiveEsports from './SidebarLiveEsports'
import SidebarFreeDrops from './SidebarFreeDrops'
import SidebarUpcomingRadar from './SidebarUpcomingRadar'
import SidebarCommunityPulse from './SidebarCommunityPulse'

export default function PortalSidebar({ className = '' }) {
  return (
    <aside className={`space-y-6 ${className}`}>
      {/* 1. Live Esports Arena */}
      <SidebarLiveEsports />

      {/* 2. Free Games Radar */}
      <SidebarFreeDrops />

      {/* 3. Upcoming Releases */}
      <SidebarUpcomingRadar />

      {/* 4. Community Pulse */}
      <SidebarCommunityPulse />
    </aside>
  )
}
