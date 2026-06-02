import { createItem } from '@directus/sdk'
import { directus } from '@/api/directus'

export const sendFeedback = async (email: string, message: string) => {
    return directus.request(createItem('feedback_messages', {
        email,
        message
    }))
}