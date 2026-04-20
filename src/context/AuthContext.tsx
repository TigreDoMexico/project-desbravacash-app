"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { tokenCache } from "@/lib/tokenCache";

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const decodeRole = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    console.log("Decoded payload:", payload);
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? payload.Role ?? payload.role ?? null;
  } catch {
    return null;
  }
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cached = tokenCache.get();
    if (cached) {
      setToken(cached);
      setRole(decodeRole(cached));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    tokenCache.set(newToken);
    setToken(newToken);
    var foo = decodeRole(newToken)

    console.log("Decoded role:", foo);

    setRole(foo);
  };

  const logout = () => {
    tokenCache.remove();
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
