// src/hooks/useTasks.ts
"use client";

import { useEffect, useState } from "react";
import { getTasks, TaskQuery } from "@/lib/api/tasks";
import type { Task } from "@/types";

export function useTasks(params?: TaskQuery) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getTasks(params);

        if (mounted) {
          setTasks(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.response?.data?.message || "Could not load tasks");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      mounted = false;
    };
  }, [params?.q, params?.category, params?.status]);

  return { tasks, loading, error };
}
