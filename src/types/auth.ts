export interface User {
  id: string;
  userName: string;
  name: string;
  avatar?: string;
  familyGroups: FamilyGroup[];
}

export interface FamilyGroup {
  id: string;
  name: string;
  members: User[];
  inviteCode?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}
