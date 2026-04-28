import { api } from "@/lib/api/axios";
import { getRefreshToken } from "@/lib/storage";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  phoneNumber?: string;
  email: string;
  password: string;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function logoutUser() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) return;

  const { data } = await api.post("/auth/logout", {
    refreshToken,
  });

  return data;
}