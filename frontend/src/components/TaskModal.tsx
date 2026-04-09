"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { getUsers, createTask } from "@/api/api";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface TaskModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  columns: { id: string; title: string }[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  show,
  onClose,
  onSave,
  columns,
}) => {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState(columns[0]?.id || "pending");
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) {
      const fetchUsers = async () => {
        try {
          setLoadingUsers(true);
          const data = await getUsers();
          setUsers(data);
          setLoadingUsers(false);
        } catch (error) {
          console.error("Failed to fetch users:", error);
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [show]);

  const handleSave = async () => {
    if (!title || !assignee) {
      alert("Please fill in the title and select an assignee");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title,
        description,
        assignedTo: assignee,
        status,
      };

      const newTask = await createTask(payload);
      onSave(newTask);

      // Reset form
      setTitle("");
      setDescription("");
      setAssignee("");
      setStatus(columns[0]?.id || "pending");
      onClose();
    } catch (error: any) {
      alert(`Error creating task: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !show) return null;

  return (
    <div className="modal-overlay d-flex align-items-center justify-content-center">
      <div
        className="glass-card p-4 rounded-4 modal-content-custom shadow-lg"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 fw-bold" style={{ color: "#000000" }}>
            Create New Task
          </h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="mb-3">
          <label className="form-label text-color-muted small">
            Task Title
          </label>
          <input
            type="text"
            className="form-control py-2"
            style={{
              backgroundColor: "#f5f5f7",
              color: "#000000",
              border: "1px solid rgba(0, 0, 0, 0.12)",
            }}
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-color-muted small">
            Description
          </label>
          <div className="quill-wrapper">
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              placeholder="Write task details here..."
            />
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label text-color-muted small">
              Assign To
            </label>
            <select
              className="form-select"
              style={{
                backgroundColor: "#f5f5f7",
                color: "#000000",
                border: "1px solid rgba(0, 0, 0, 0.12)",
              }}
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              disabled={loadingUsers}
            >
              <option value="">
                {loadingUsers ? "Loading users..." : "Select Assignee"}
              </option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label text-color-muted small">Status</label>
            <select
              className="form-select text-capitalize"
              style={{
                backgroundColor: "#f5f5f7",
                color: "#000000",
                border: "1px solid rgba(0, 0, 0, 0.12)",
              }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn px-4"
            style={{
              backgroundColor: "#e5e5e7",
              color: "#000000",
              border: "1px solid rgba(0, 0, 0, 0.12)",
            }}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary px-4"
            style={{ background: "#5D5FEF" }}
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 2000;
        }
        .modal-content-custom {
          background: rgba(255, 255, 255, 0.98) !important;
          border: 1px solid rgba(0, 0, 0, 0.12) !important;
        }
        .quill-wrapper :global(.ql-toolbar) {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background: #f5f5f7;
          border: 1px solid rgba(0, 0, 0, 0.12) !important;
        }
        .quill-wrapper :global(.ql-container) {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.12) !important;
          min-height: 150px;
          font-family: inherit;
        }
        .quill-wrapper :global(.ql-editor) {
          color: #000000;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default TaskModal;
