"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api/auth";
import {
  setAccessToken,
  setRefreshToken,
  setStoredUser,
} from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

interface AuthFormPayload {
  isSignup: boolean;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  redirect?: string;
}

export function useAuthForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submitAuth = async ({
    isSignup,
    email,
    password,
    fullName,
    phoneNumber,
    redirect = "/",
  }: AuthFormPayload) => {
    setLoading(true);

    try {
      const data = isSignup
        ? await registerUser({
            fullName: fullName || "",
            email,
            password,
          })
        : await loginUser({ email, password });

      if (data.accessToken) setAccessToken(data.accessToken);
      if (data.refreshToken) setRefreshToken(data.refreshToken);
      if (data.user) setStoredUser(data.user);

      toast({
        title: isSignup ? "Account created" : "Welcome back",
        description: isSignup
          ? "Your HireCore account has been created."
          : "You have signed in successfully.",
      });

      router.push(redirect);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Auth failed",
        description:
          err.response?.data?.message ||
          err.message ||
          "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { submitAuth, loading };
}