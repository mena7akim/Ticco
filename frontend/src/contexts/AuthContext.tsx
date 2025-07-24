import { createContext, useEffect, useState, useCallback } from "react";
import {
  isAuthenticated,
  removeAuthToken,
  getAuthenticatedUser,
} from "@/services/authService";
import type { AuthUser } from "@/types/types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  getCurrentUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated()) {
        const userData = await getAuthenticatedUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("failed to fetch user.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeAuthToken();
    setUser(null);
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const value = {
    user,
    isLoading,
    logout,
    setUser,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
