export interface UserProfile {
  id: string;
  username: string;
  user_id: {
    id: string;
  };
  friendship?: {
    status: string | null;
    friendshipId: string | null;
    iAmRequester: boolean;
  };
  avatar?: string | null
  bio?: string | null
  is_public?: boolean
  date_created?: string
  date_updated?: string
}