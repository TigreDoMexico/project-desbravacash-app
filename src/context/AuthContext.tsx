"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { tokenCache } from "@/lib/tokenCache";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cached = tokenCache.get();
    if (cached) setToken(cached);
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    tokenCache.set(newToken);
    setToken(newToken);
  };

  const logout = () => {
    tokenCache.remove();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
