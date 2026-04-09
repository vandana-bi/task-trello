"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  assigneeName?: string;
  priority?: string;
  progress?: number;
  comments?: number;
  attachments?: number;
  urgent?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  assigneeName,
  priority,
  progress,
  comments,
  attachments,
  urgent,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.div
        whileHover={{ y: -4 }}
        className="glass-card mb-3 p-3 text-start"
      >
        <h6
          className="mb-2"
          style={{ fontSize: "1.1rem", color: "#000000", fontWeight: 600 }}
        >
          {title}
        </h6>
        <p
          className="text-color-muted small mb-3"
          style={{ fontSize: "0.9rem", lineHeight: "1.4" }}
          dangerouslySetInnerHTML={{ __html: description }}
        />

        <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-dark border-opacity-10">
          <div className="d-flex align-items-center">
            <div className="d-flex" style={{ marginLeft: "0px" }}>
              <span className="text-color-muted small pe-2">Assign To:</span>
              <span className="small text-dark">
                {assigneeName || "Unassigned"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskCard;
