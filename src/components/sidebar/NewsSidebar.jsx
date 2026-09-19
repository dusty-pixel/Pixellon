import SidebarTrendingNews from './SidebarTrendingNews'
import SidebarReviewScores from './SidebarReviewScores'
import SidebarUpcomingRadar from './SidebarUpcomingRadar'
import SidebarCommunityPulse from './SidebarCommunityPulse'

export default function NewsSidebar({ articles, className = '' }) {
  return (
    <aside className={`space-y-6 ${className}`}>
      {/* 1. Trending Stories */}
      <SidebarTrendingNews articles={articles} />

      {/* 2. Review Scores */}
      <SidebarReviewScores />

      {/* 3. Upcoming Releases */}
      <SidebarUpcomingRadar />

      {/* 4. Community Pulse */}
      <SidebarCommunityPulse />
    </aside>
  )
}
