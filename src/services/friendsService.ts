import directus from "../api/directus";
import { createItem, deleteItem, updateItem, readItems } from "@directus/sdk";


// Función auxiliar para obtener perfiles de usuarios
const getUserProfiles = async (userIds: (string | undefined)[]) => {
    const ids = Array.from(new Set(userIds.filter(Boolean)))
    if (ids.length === 0) return new Map()

    const profiles = await directus.request(readItems("user_profiles", {
        filter: {
            user_id: { _in: ids }
        },
        fields: ['*']
    }))

    const profilesMap = new Map()
    profiles.forEach((p: any) => {
        profilesMap.set(p.user_id, p)
    })
    return profilesMap
}

export const sendFriendRequest = async (requesterId: string, addresseeId: string) => {
    return directus.request(createItem("friendships", {
        requester_id: requesterId,
        addressee_id: addresseeId,
        status: 'pending'
    }))
}

export const acceptFriendRequest = async (friendshipId: string) => {
    return directus.request(updateItem("friendships", friendshipId, {
        status: 'accepted'
    }))
}

export const rejectFriendRequest = async (friendshipId: string) => {
    return directus.request(deleteItem("friendships", friendshipId))
}

export const removeFriend = async (friendshipId: string) => {
    return directus.request(deleteItem("friendships", friendshipId))
}

export const getFriends = async (userId: string) => {
    const friendships = await directus.request(readItems("friendships", {
        filter: {
            _or: [
                { requester_id: { _eq: userId } },
                { addressee_id: { _eq: userId } }
            ],
            status: { _eq: 'accepted' }
        },
        fields: [
            '*',
            'requester_id.*',
            'addressee_id.*',
        ]
    }))

    // Obtener IDs de los otros usuarios
    const userIds = [
        ...friendships.map((f: any) => f.requester_id?.id),
        ...friendships.map((f: any) => f.addressee_id?.id)
    ]

    // Obtener perfiles
    const profilesMap = await getUserProfiles(userIds)

    // Agregar perfiles a las amistades
    return friendships.map((f: any) => ({
        ...f,
        requester_id: {
            ...f.requester_id,
            user_profiles: profilesMap.get(f.requester_id?.id)
        },
        addressee_id: {
            ...f.addressee_id,
            user_profiles: profilesMap.get(f.addressee_id?.id)
        }
    }))
}

export const getPendingRequests = async (userId: string) => {
    const requests = await directus.request(readItems("friendships", {
        filter: {
            addressee_id: { _eq: userId },
            status: { _eq: 'pending' }
        },
        fields: ['*', 'requester_id.*']
    }))

    const requesterIds = requests.map((r: any) => r.requester_id?.id)
    const profilesMap = await getUserProfiles(requesterIds)

    // Agregar perfiles a las solicitudes
    return requests.map((r: any) => ({
        ...r,
        requester_id: {
            ...r.requester_id,
            user_profiles: profilesMap.get(r.requester_id?.id)
        }
    }))
}

export const getSentRequests = async (userId: string) => {
    const requests = await directus.request(readItems("friendships", {
        filter: {
            requester_id: { _eq: userId },
            status: { _eq: 'pending' }
        },
        fields: ['*', 'addressee_id.*']
    }))

    const addresseeIds = requests.map((r: any) => r.addressee_id?.id)
    const profilesMap = await getUserProfiles(addresseeIds)

    // Agregar perfiles a las solicitudes
    return requests.map((r: any) => ({
        ...r,
        addressee_id: {
            ...r.addressee_id,
            user_profiles: profilesMap.get(r.addressee_id?.id)
        }
    }))
}

export const getFriendshipStatus = async (userId: string, targetId: string) => {
    const items = await directus.request(readItems("friendships", {
        filter: {
            _or: [
                {
                    requester_id: { _eq: userId },
                    addressee_id: { _eq: targetId }
                },
                {
                    requester_id: { _eq: targetId },
                    addressee_id: { _eq: userId }
                }
            ]
        },
        limit: 1
    }))

    if (items.length === 0) return { status: null, friendshipId: null }

    return {
        status: items[0].status,
        friendshipId: items[0].id,
        iAmRequester: items[0].requester_id === userId
    }
}

export const searchUsers = async (username: string, currentUserId: string) => {
    const profiles = await directus.request(readItems("user_profiles", {
        filter: {
            username: { _contains: username },
            user_id: { _neq: currentUserId }
        },
        fields: ['*', 'user_id.id'],
        limit: 10
    }))

    const results = await Promise.all(profiles.map(async (profile: any) => {
        const friendship = await getFriendshipStatus(currentUserId, profile.user_id.id)
        return { ...profile, friendship }
    }))

    return results
}