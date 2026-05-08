import UserCard from "@/components/friends/UserCard"
import { TabContent } from "./TabContent"

interface PendingSectionProps {
  pendingRequests: any[]
  loading: boolean
  loadingAction: string | null
  onAccept: (friendshipId: string) => void
  onReject: (friendshipId: string) => void
}

export const PendingSection: React.FC<PendingSectionProps> = ({
  pendingRequests,
  loading,
  loadingAction,
  onAccept,
  onReject,
}) => {
  return (
    <TabContent
      loading={loading}
      isEmpty={pendingRequests.length === 0}
      emptyMessage="No hay solicitudes pendientes"
      data={pendingRequests}
      renderItem={(request) => (
        <UserCard
          key={request.id}
          username={request.requester_id?.user_profiles?.username || "Usuario"}
          userId={request.requester_id?.id}
          avatar={request.requester_id?.user_profiles?.avatar}
          status="pending_received"
          onAcceptRequest={() => onAccept(request.id)}
          onRejectRequest={() => onReject(request.id)}
          isLoading={loadingAction === request.id}
        />
      )}
    />
  )
}
