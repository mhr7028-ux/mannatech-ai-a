export type UserRole = 'admin' | 'member';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  rank?: string;
  teamName?: string;
  memberId?: string;
}

export interface AppSession {
  user: UserProfile;
  expires: string;
}
