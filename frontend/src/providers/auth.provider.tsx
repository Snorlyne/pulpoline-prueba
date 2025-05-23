import { type JSX, type ReactNode, useState } from "react";
import { AuthContext } from "../contexts/auth.context";
import type { AuthContextType } from "../types/auth.type";
import ModalAuth from "../components/Auth/ModalAuth";

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUserState] = useState<AuthContextType["user"]>(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    return token && username ? { token, username } : null;
  });

  const setUser = (username: string, token: string | null) => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      setUserState({ username, token });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setUserState(null);
    }
  };

  const isAuthenticated = !!user?.token;

  // ModalAuth state
  const [openAuthModal, setOpenAuthModal] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        openAuthModal: () => setOpenAuthModal(true),
        closeAuthModal: () => setOpenAuthModal(false),
      }}
    >
      {children}
      <ModalAuth open={openAuthModal} onClose={() => setOpenAuthModal(false)} />
    </AuthContext.Provider>
  );
};
