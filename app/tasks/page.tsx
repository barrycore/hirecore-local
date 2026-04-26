
import { Suspense } from "react";
import { motion } from "framer-motion";
import TaskCard, { TaskCardSkeleton } from "@/components/shared/task-card";
import EmptyState from "@/components/shared/empty-state";
import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/types";
import TasksHero from "./TaskHero";
import SectionDivider from "@/components/shared/section-divider";

interface TasksPageProps {
  searchParams: {
    q?: string
    category?: string
    status?: string
  }
}

export default function TasksPage({ searchParams }: TasksPageProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(95,82,255,0.22),transparent_30%),linear-gradient(180deg,#110f1f_0%,#0c0a16_55%,#0f0d18_100%)] text-white">

  <TasksHero searchParams={searchParams} />
<SectionDivider variant="wave" flip />
      {/* ===== TASK GRID ===== */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<TasksLoading />}>
            <TasksList searchParams={searchParams} />
          </Suspense>
        </div>

        {tasks.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <EmptyState title="No matching tasks" description="Try a broader search or clear some filters." />
        )}
      </section>
    </div>
  )
}
