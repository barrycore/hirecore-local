// src/providers/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "@/lib/api/auth";
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  setStoredUser,
} from "@/lib/storage";
import { logoutUser } from "@/lib/api/auth";

interface AuthContextValue {
  user: any | null;
  loading: boolean;
  authenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
    } finally {
      clearAuthStorage();
      setUser(null);
      window.location.href = "/auth/login";
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        setLoading(false);
        return;
      }

      const cachedUser = getStoredUser<any>();

      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const freshUser = await getMe();
        setUser(freshUser);
        setStoredUser(freshUser);
      } catch {
        clearAuthStorage();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated: Boolean(user),
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
