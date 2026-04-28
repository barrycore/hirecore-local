// src/hooks/useLogin.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import { setAccessToken, setStoredUser } from "@/lib/storage";
import { useAuth } from "@/providers/AuthProvider";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string, redirect = "/") => {
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      setAccessToken(data.accessToken);
      setStoredUser(data.user);
      setUser(data.user);

      router.push(redirect);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}