import UserCard from "@/components/friends/UserCard"
import { TabContent } from "./TabContent"

interface FriendsSectionProps {
  friends: any[]
  loading: boolean
  loadingAction: string | null
  onRemoveFriend: (friendshipId: string) => void
  onSearchClick: () => void
  userId?: string
}

export const FriendsSection: React.FC<FriendsSectionProps> = ({
  friends,
  loading,
  loadingAction,
  onRemoveFriend,
  onSearchClick,
  userId,
}) => {
  if (!loading && friends.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Aún no tienes amigos</p>
        <button
          onClick={onSearchClick}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
        >
        </button>
      </div>
    )
  }

  return (
    <TabContent
      loading={loading}
      isEmpty={false}
      emptyMessage=""
      data={friends}
      renderItem={(friend) => {
        const otherUser =
          friend.requester_id?.id === userId
            ? friend.addressee_id
            : friend.requester_id

        const avatarId = otherUser?.user_profiles?.avatar

        return (
          <UserCard
            key={friend.id}
            username={otherUser?.user_profiles?.username || "Usuario"}
            userId={otherUser?.id}
            avatar={avatarId}
            status="friend"
            onRemoveFriend={() => onRemoveFriend(friend.id)}
            isLoading={loadingAction === friend.id}
          />
        )
      }}
    />
  )
}
