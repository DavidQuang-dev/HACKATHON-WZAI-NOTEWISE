export interface User {
  id: string;
  name: string;
  email: string;
  birthday: string | null;
  phone: string | null;
  avatar: string | null;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  hasHydrated: boolean; // Flag to check if the state has been loaded from storage
}

export interface AuthActions {
  setAuth: (user: User | null, accessToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<boolean>;
  loginWithGoogle: () => void;
  loginWithEmail: (email: string) => void;
  setState: (state: Partial<AuthState>) => void;
}

export type AuthStore = AuthState & AuthActions;
