import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface TaskColumnProps {
  id: string;
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  id,
  title,
  count,
  color,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const isDone = title.toUpperCase() === "COMPLETED";

  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div
        ref={setNodeRef}
        className={`h-100 p-3 rounded-4 transition-all board-column ${isOver ? "is-over" : ""}`}
        style={{
          minHeight: "650px",
          background: "#f5f5f7",
          border: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <div
          className="d-flex align-items-center mb-4 p-3 rounded-3"
          style={{
            backgroundColor: color,
            borderLeft: `4px solid ${color}`,
            color: "#ffffff",
          }}
        >
          <div
            className="rounded-circle me-2"
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          ></div>
          <h6
            className="mb-0 text-uppercase small letter-spacing-widest fw-bold"
            style={{ color: "#000000" }}
          >
            {title}
          </h6>
        </div>
        <div className="task-list">{children}</div>
      </div>
      <style jsx>{`
        .letter-spacing-widest {
          letter-spacing: 0.1em;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        .board-column {
          position: relative;
        }
        .is-over {
          background: rgba(93, 95, 239, 0.08) !important;
          border-color: rgba(93, 95, 239, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default TaskColumn;
