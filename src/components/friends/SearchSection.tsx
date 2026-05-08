import { useState } from "react"
import { FiSearch } from "react-icons/fi"
import { useSearchUsers } from "@/hooks/useSearchUsers"
import UserCard from "@/components/friends/UserCard"
import { TabContent } from "./TabContent"

interface SearchSectionProps {
  userId: string
  loadingAction: string | null
  onSendRequest: (targetUserId: string) => Promise<boolean>
  getSearchUserStatus: (userId: string) => "friend" | "pending_received" | "pending_sent" | "none"
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  userId,
  loadingAction,
  onSendRequest,
  getSearchUserStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const { users: searchUsers, loading: searchLoading } = useSearchUsers(searchTerm, userId)

  return (
    <div>
      {/* Search Input */}
      <div className="mb-8">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre de usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cy focus:ring-2 focus:ring-yellow-400/20"
          />
        </div>
      </div>

      {/* Results */}
      {!searchTerm ? (
        <div className="text-center py-12 text-gray-400">
          Escribe un nombre para buscar
        </div>
      ) : searchLoading ? (
        <div className="flex justify-center py-12">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-cy animate-bounce" />
            <div className="w-2 h-2 bg-cy animate-bounce delay-100" />
            <div className="w-2 h-2 bg-cy animate-bounce delay-200" />
          </div>
        </div>
      ) : (
        <TabContent
          loading={false}
          isEmpty={searchUsers.length === 0}
          emptyMessage="No se encontraron usuarios"
          data={searchUsers}
          renderItem={(searchUser) => {
            const status = getSearchUserStatus(searchUser.user_id.id)
            return (
              <UserCard
                key={searchUser.user_id.id}
                username={searchUser.username}
                userId={searchUser.user_id.id}
                avatar={searchUser.avatar}
                status={status}
                onAddFriend={() => onSendRequest(searchUser.user_id.id)}
                isLoading={loadingAction === searchUser.user_id.id}
              />
            )
          }}
        />
      )}
    </div>
  )
}
