import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { useFriendsData } from "@/hooks/useFriendsData"
import { FriendsSection } from "@/components/friends/FriendsSection"
import { PendingSection } from "@/components/friends/PendingSection"
import { SentSection } from "@/components/friends/SentSection"
import { SearchSection } from "@/components/friends/SearchSection"
import { FiUsers, FiInbox, FiSend, FiPlus } from "react-icons/fi"
import { usePageTitle } from '@/hooks/usePageTitle'

type TabType = "friends" | "pending" | "sent" | "search"

export const FriendsPage = () => {
   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const user = useAuthStore(state => state.user)
  usePageTitle("Amigos")
  const [activeTab, setActiveTab] = useState<TabType>("friends")

  const {
    friends,
    pendingRequests,
    sentRequests,
    loading,
    loadingAction,
    getSearchUserStatus,
    handleSendRequest,
    handleAcceptRequest,
    handleRejectRequest,
    handleRejectSentRequest,
    handleRemoveFriend,
  } = useFriendsData(user?.id)

  // Tab configuration
  const tabs: { id: TabType; label: string; icon: any; count?: number }[] = [
    { id: "friends", label: "Amigos", icon: FiUsers, count: friends.length },
    { id: "pending", label: "Solicitudes", icon: FiInbox, count: pendingRequests.length },
    { id: "sent", label: "Enviadas", icon: FiSend, count: sentRequests.length },
    { id: "search", label: "Añadir amigo", icon: FiPlus },
  ]

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId)
  }

  return (
    <div className="w-full min-h-screen px-4 py-8 bg-black/90">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-cy mb-2 uppercase tracking-wide">
            Amigos
          </h1>
          <p className="text-gray-400">Gestiona tus amistades y conecta con otros jugadores</p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-cy text-black shadow-md shadow-cy/50"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-2 py-0.5 text-xs ${
                      activeTab === tab.id ? "bg-black/20" : "bg-gray-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "friends" && (
          <FriendsSection
            friends={friends}
            loading={loading}
            loadingAction={loadingAction}
            onRemoveFriend={handleRemoveFriend}
            onSearchClick={() => handleTabChange("search")}
            userId={user?.id}
          />
        )}

        {activeTab === "pending" && (
          <PendingSection
            pendingRequests={pendingRequests}
            loading={loading}
            loadingAction={loadingAction}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />
        )}

        {activeTab === "sent" && (
          <SentSection
            sentRequests={sentRequests}
            loading={loading}
            loadingAction={loadingAction}
            onRejectRequest={handleRejectSentRequest}
          />
        )}

        {activeTab === "search" && (
          <SearchSection
            userId={user?.id || ""}
            loadingAction={loadingAction}
            onSendRequest={handleSendRequest}
            getSearchUserStatus={getSearchUserStatus}
          />
        )}
      </div>
    </div>
  )
}