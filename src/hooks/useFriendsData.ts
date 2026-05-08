import { useState, useEffect, useCallback, useMemo } from "react"
import {sendFriendRequest,getFriends,getPendingRequests,getSentRequests,acceptFriendRequest,rejectFriendRequest,removeFriend} from "@/services/friendsService"

export const useFriendsData = (userId: string | undefined) => {
  const [friends, setFriends] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [sentRequests, setSentRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  // Memoizar maps para búsquedas rápidas
  const friendsMap = useMemo(() => {
    const map = new Set<string>()
    friends.forEach(f => {
      map.add(f.requester_id?.id)
      map.add(f.addressee_id?.id)
    })
    return map
  }, [friends])

  const pendingReceivedMap = useMemo(() => {
    const map = new Map<string, any>()
    pendingRequests.forEach(r => {
      map.set(r.requester_id?.id, r)
    })
    return map
  }, [pendingRequests])

  const sentMap = useMemo(() => {
    const map = new Map<string, any>()
    sentRequests.forEach(r => {
      map.set(r.addressee_id?.id, r)
    })
    return map
  }, [sentRequests])

  // Fetch inicial
  const fetchFriendsData = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const [friendsList, pending, sent] = await Promise.all([
        getFriends(userId),
        getPendingRequests(userId),
        getSentRequests(userId),
      ])
      setFriends(friendsList)
      setPendingRequests(pending)
      setSentRequests(sent)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching data")
      console.error("Error fetching friends data:", err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchFriendsData()
  }, [fetchFriendsData])

  // Get status for search users
  const getSearchUserStatus = useCallback((targetUserId: string) => {
    if (friendsMap.has(targetUserId)) return "friend"
    if (pendingReceivedMap.has(targetUserId)) return "pending_received"
    if (sentMap.has(targetUserId)) return "pending_sent"
    return "none"
  }, [friendsMap, pendingReceivedMap, sentMap])

  // Send request
  const handleSendRequest = useCallback(async (targetUserId: string): Promise<boolean> => {
    if (!userId) return false
    try {
      setLoadingAction(targetUserId)
      await sendFriendRequest(userId, targetUserId)
      const sent = await getSentRequests(userId)
      setSentRequests(sent)
      return true
    } catch (err) {
      console.error("Error sending request:", err)
      return false
    } finally {
      setLoadingAction(null)
    }
  }, [userId])

  // Accept request
  const handleAcceptRequest = useCallback(async (friendshipId: string): Promise<boolean> => {
    if (!userId) return false
    try {
      setLoadingAction(friendshipId)
      await acceptFriendRequest(friendshipId)
      const [friendsList, pending] = await Promise.all([
        getFriends(userId),
        getPendingRequests(userId),
      ])
      setFriends(friendsList)
      setPendingRequests(pending)
      return true
    } catch (err) {
      console.error("Error accepting request:", err)
      return false
    } finally {
      setLoadingAction(null)
    }
  }, [userId])

  // Reject request
  const handleRejectRequest = useCallback(async (friendshipId: string): Promise<boolean> => {
    if (!userId) return false
    try {
      setLoadingAction(friendshipId)
      await rejectFriendRequest(friendshipId)
      const pending = await getPendingRequests(userId)
      setPendingRequests(pending)
      return true
    } catch (err) {
      console.error("Error rejecting request:", err)
      return false
    } finally {
      setLoadingAction(null)
    }
  }, [userId])

  // Remove friend
  const handleRemoveFriend = useCallback(async (friendshipId: string): Promise<boolean> => {
    if (!userId) return false
    try {
      setLoadingAction(friendshipId)
      await removeFriend(friendshipId)
      const friendsList = await getFriends(userId)
      setFriends(friendsList)
      return true
    } catch (err) {
      console.error("Error removing friend:", err)
      return false
    } finally {
      setLoadingAction(null)
    }
  }, [userId])

  // Reject sent request
  const handleRejectSentRequest = useCallback(async (friendshipId: string): Promise<boolean> => {
    if (!userId) return false
    try {
      setLoadingAction(friendshipId)
      await rejectFriendRequest(friendshipId)
      const sent = await getSentRequests(userId)
      setSentRequests(sent)
      return true
    } catch (err) {
      console.error("Error rejecting sent request:", err)
      return false
    } finally {
      setLoadingAction(null)
    }
  }, [userId])

  return {
    friends,
    pendingRequests,
    sentRequests,
    loading,
    error,
    loadingAction,
    getSearchUserStatus,
    handleSendRequest,
    handleAcceptRequest,
    handleRejectRequest,
    handleRejectSentRequest,
    handleRemoveFriend,
    refetch: fetchFriendsData,
  }
}
