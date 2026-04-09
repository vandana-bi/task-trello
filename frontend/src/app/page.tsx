"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TaskColumn from "@/components/TaskColumn";
import TaskCard from "@/components/TaskCard";
import DataTable from "@/components/DataTable";
import TaskModal from "@/components/TaskModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { getAllTasks, updateTask } from "@/api/api";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Task {
  _id: string; // Updated to match backend
  status: string; // Updated to match backend
  priority: string;
  title: string;
  description: string;
  assignedTo?: {
    name: string;
    email: string;
  };
  assignedBy?: {
    name: string;
    email: string;
  };
}

const COLUMNS = [
  { id: "pending", title: "Pending", color: "#8E8E93" },
  { id: "on progress", title: "On Progress", color: "#5D5FEF" },
  { id: "on review", title: "On Review", color: "#A5A6F6" },
  { id: "completed", title: "Completed", color: "#10B981" },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const { user, loading } = useAuth();
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      fetchTasks();
    }
  }, [user, loading, router]);

  if (loading || (!user && mounted)) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleAddTask = (newTask: any) => {
    fetchTasks(); // Refresh list after adding
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeTask = tasks.find((t) => t._id === activeId);
    if (!activeTask) return;

    let newStatus = activeTask.status;

    // Is it dropping over a column?
    const isOverAColumn = COLUMNS.some((col) => col.id === overId);

    if (isOverAColumn) {
      if (activeTask.status !== overId) {
        newStatus = overId;
      }
    } else {
      // Is it dropping over another task?
      const overTask = tasks.find((t) => t._id === overId);
      if (overTask && activeTask.status !== overTask.status) {
        newStatus = overTask.status;
      }
    }

    if (newStatus !== activeTask.status) {
      try {
        // Optimistic update
        setTasks((prev) =>
          prev.map((t) =>
            t._id === activeId ? { ...t, status: newStatus } : t,
          ),
        );

        // Backend update
        await updateTask(activeId, { status: newStatus });

        // Refresh to ensure sync
        fetchTasks();
      } catch (error) {
        console.error("Failed to update task status:", error);
        fetchTasks(); // Revert on error
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onAddTaskClick={() => setShowModal(true)} />

      {mounted && (
        <TaskModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleAddTask}
          columns={COLUMNS}
        />
      )}

      <main className="container-fluid px-4 flex-grow-1">
        {mounted && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <section className="row mb-5">
              {COLUMNS.map((col) => {
                const columnTasks = tasks.filter((t) => t.status === col.id);
                return (
                  <TaskColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    count={columnTasks.length}
                    color={col.color}
                  >
                    <SortableContext
                      items={columnTasks.map((t) => t._id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {columnTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          id={task._id}
                          title={task.title}
                          description={task.description}
                          assigneeName={task.assignedTo?.name}
                        />
                      ))}
                    </SortableContext>
                  </TaskColumn>
                );
              })}
            </section>
          </DndContext>
        )}

        {/* Assigned Tasks Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="h3 mb-1">Assigned Tasks:</h2>
              <p className="text-color-muted mb-0 small">
                Real-time resource allocation and time tracking telemetry.
              </p>
            </div>
          </div>
          <DataTable />
        </section>
      </main>

      {/* <Footer /> */}

      <style jsx global>{`
        .glass-card {
        }
      `}</style>
    </div>
  );
}
