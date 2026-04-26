'use server';
import { Suspense } from "react";
import TaskCard, { TaskCardSkeleton } from "@/components/shared/task-card";
import EmptyState from "@/components/shared/empty-state";
import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/types";
import TasksHero from "./TaskHero";
import SectionDivider from "@/components/shared/section-divider";

interface TasksPageProps {
  searchParams: {
    q?: string;
    category?: string;
    status?: string;
  };
}

export default function TasksPage({ searchParams }: TasksPageProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(95,82,255,0.22),transparent_30%),linear-gradient(180deg,#110f1f_0%,#0c0a16_55%,#0f0d18_100%)] text-white">
      <TasksHero searchParams={searchParams} />

      <SectionDivider variant="wave" flip />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <Suspense fallback={<TasksLoading />}>
            <TasksList searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function TasksList({ searchParams }: TasksPageProps) {
  const supabase = await createClient();

  let query = supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (searchParams.q) {
    query = query.ilike("title", `%${searchParams.q}%`);
  }

  if (searchParams.category && searchParams.category !== "all") {
    query = query.eq("category", searchParams.category);
  }

  if (searchParams.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);

    return (
      <EmptyState
        title="Could not load tasks"
        description="Something went wrong while fetching tasks."
      />
    );
  }

  const tasks = (data ?? []) as Task[];

  if (!tasks.length) {
    return (
      <EmptyState
        title="No matching tasks"
        description="Try a broader search or clear some filters."
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

function TasksLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <TaskCardSkeleton key={index} />
      ))}
    </div>
  );
}