import { readItems, uploadFiles, updateItem } from '@directus/sdk'
import { directus } from '@/api/directus'
import { mapDirectusToGame } from "./gamesService";

export const getUserProfile = async (userId: string) => {
    const profiles = await directus.request(readItems("user_profiles", {
        filter: { user_id: { _eq: userId } },
        limit: 1,
        fields: ['*']
    }))

    if (profiles.length === 0) return null

    return profiles[0]
}

const getProfileId = async (userId: string): Promise<string | null> => {
    const profiles = await directus.request(readItems("user_profiles", {
        filter: { user_id: { _eq: userId } },
        limit: 1,
        fields: ['id']
    }))
    return profiles.length > 0 ? profiles[0].id : null
}

export const updateUsername = async (userId: string, username: string) => {
    const profileId = await getProfileId(userId)
    if (!profileId) return
    return directus.request(updateItem("user_profiles", profileId, { username }))
}

export const updateBio = async (userId: string, bio: string) => {
    const profileId = await getProfileId(userId)
    if (!profileId) return
    return directus.request(updateItem("user_profiles", profileId, { bio }))
}

export const updateIsPublic = async (userId: string, isPublic: boolean) => {
    const profileId = await getProfileId(userId)
    if (!profileId) return
    return directus.request(updateItem("user_profiles", profileId, { is_public: isPublic }))
}

export const updateAvatar = async (userId: string, file: File) => {
    const profileId = await getProfileId(userId)
    if (!profileId) return

    const formData = new FormData()
    formData.append('file', file)

    const uploadedFile = await directus.request(uploadFiles(formData))

    return directus.request(updateItem("user_profiles", profileId, {
        avatar: uploadedFile.id
    }))
}

export const getOtherProfile = async (userId: string) => {
    const profiles = await directus.request(readItems("user_profiles", {
        filter: { user_id: { _eq: userId } },
        limit: 1,
        fields: ['*']
    }))

    return profiles.length > 0 ? profiles[0] : null
}

export const getOtherLibrary = async (userId: string) => {
    const libraryItems = await directus.request(readItems("library", {
        filter: { user_id: { _eq: userId } },
        fields: ['*', 'game_id.*', 'game_id.genres.genres_id.*']
    }))

    if (libraryItems.length === 0) return []

    return libraryItems.map((entry: any) => mapDirectusToGame(entry.game_id, entry))
}
