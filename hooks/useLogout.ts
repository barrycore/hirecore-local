// src/hooks/useLogout.ts
"use client";

import { useAuth } from "@/providers/AuthProvider";

export function useLogout() {
  const { logout } = useAuth();

  return { logout };
}