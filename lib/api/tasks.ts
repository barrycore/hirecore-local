// src/lib/api/tasks.ts
import { api } from "./axios";

export interface TaskQuery {
  q?: string;
  category?: string;
  status?: string;
}

export async function getTasks(params?: TaskQuery) {
  const { data } = await api.get("/tasks", { params });
  return data;
}

export async function getTask(id: string) {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
}