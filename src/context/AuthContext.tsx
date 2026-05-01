"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { tokenCache } from "@/lib/tokenCache";

interface AuthContextType {
  token: string | null;
  role: string | null;
  name: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const decodePayload = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const decodeRole = (payload: Record<string, string>): string | null =>
  payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? payload.Role ?? payload.role ?? null;

const decodeName = (payload: Record<string, string>): string | null =>
  payload["name"] ?? payload.Name ?? payload.name ?? payload.unique_name ?? null;

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cached = tokenCache.get();
    if (cached) {
      const payload = decodePayload(cached);
      if (payload) {
        setToken(cached);
        setRole(decodeRole(payload));
        setName(decodeName(payload));
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    tokenCache.set(newToken);
    const payload = decodePayload(newToken);
    setToken(newToken);
    setRole(payload ? decodeRole(payload) : null);
    setName(payload ? decodeName(payload) : null);
  };

  const logout = () => {
    tokenCache.remove();
    setToken(null);
    setRole(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, name, login, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
