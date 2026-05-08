import UserCard from "@/components/friends/UserCard"
import { TabContent } from "./TabContent"

interface SentSectionProps {
  sentRequests: any[]
  loading: boolean
  loadingAction?: string | null
  onRejectRequest?: (friendshipId: string) => void
}

export const SentSection = ({sentRequests, loading, loadingAction, onRejectRequest}: SentSectionProps) => {
  return (
    <TabContent
      loading={loading}
      isEmpty={sentRequests.length === 0}
      emptyMessage="No hay solicitudes enviadas"
      data={sentRequests}
      renderItem={(request) => (
        <UserCard
          key={request.id}
          username={request.addressee_id?.user_profiles?.username || "Usuario"}
          userId={request.addressee_id?.id}
          avatar={request.addressee_id?.user_profiles?.avatar}
          status="pending_sent"
          friendshipId={request.id}
          onRejectRequest={() => onRejectRequest?.(request.id)}
          isLoading={loadingAction === request.id}
        />
      )}
    />
  )
}
