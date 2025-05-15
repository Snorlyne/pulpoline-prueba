export interface AuthContextType {
  user: { username: string; token: string } | null;
  setUser: (username: string, token: string | null) => void;
  isAuthenticated: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}