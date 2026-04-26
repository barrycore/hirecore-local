
import { Suspense } from "react";
import { Search, Section, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import TaskCard, { TaskCardSkeleton } from "@/components/shared/task-card";
import EmptyState from "@/components/shared/empty-state";
import { createClient } from "@/lib/supabase/server";
import { TASK_CATEGORIES } from "@/lib/utils";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";
import TasksHero from "./TaskHero";
import SectionDivider from "@/components/shared/section-divider";

interface TasksPageProps {
  searchParams: {
    q?: string;
    category?: string;
    status?: string;
  };
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

async function TasksList({ searchParams }: TasksPageProps) {
  const supabase = await createClient();

  let query = supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  query = searchParams.status
    ? query.eq("status", searchParams.status)
    : query.eq("status", "OPEN");

  if (searchParams.category && searchParams.category !== "all") {
    query = query.eq("category", searchParams.category);
  }

  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%,location.ilike.%${searchParams.q}%`
    );
  }

  const { data: tasks, error } = await query.returns<Task[]>();

  if (error) {
    return (
      <EmptyState
        title="Failed to load tasks"
        description="Try refreshing the page."
      />
    );
  }

  if (!tasks?.length) {
    return (
      <EmptyState
        title="No tasks found"
        description="Try adjusting your filters."
      />
    );
  }

  return (
    <motion.div
      {...fadeUp}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {tasks.map((task: Task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </motion.div>
  );
}

function TasksLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function TasksPage({ searchParams }: TasksPageProps) {
  const activeCategory = searchParams.category || "all";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

  <TasksHero searchParams={searchParams} />
<SectionDivider variant="wave" flip />
      {/* ===== TASK GRID ===== */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<TasksLoading />}>
            <TasksList searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      {/* ===== BOTTOM FADE (like homepage) ===== */}
      <div className="h-32 bg-gradient-to-b from-transparent to-[#0a0a0f]" />
    </div>
  );
}