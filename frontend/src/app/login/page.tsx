"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/authContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await login({ email, password });
      router.push("/"); // Redirect to home/dashboard on success
    } catch (err: any) {
      setLocalError(
        err.message || "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light text-dark p-4"
      style={{
        background:
          "radial-gradient(circle at top right, #f8fbff 0%, #ffffff 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-5 rounded-5"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <form onSubmit={handleSubmit}>
          {localError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="alert alert-danger border-0 rounded-3 mb-4 py-3 small text-center"
              style={{ background: "rgba(220, 53, 69, 0.1)", color: "#ff6b6b" }}
            >
              {localError}
            </motion.div>
          )}

          <div className="mb-4">
            <label className="form-label small text-color-muted mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="form-control rounded-3 py-3"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              style={{
                backgroundColor: "#f4f6fb",
                color: "#000000",
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            />
          </div>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label small text-color-muted mb-0">
                Password
              </label>
            </div>
            <input
              type="password"
              className="form-control rounded-3 py-3"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              style={{
                backgroundColor: "#f4f6fb",
                color: "#000000",
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 rounded-3 fw-bold mb-4 shadow-lg transition-all"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #5d5fef 0%, #3b46c1 100%)",
              border: "none",
            }}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            ) : null}
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>
      </motion.div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 30px 70px -25px rgba(15, 23, 42, 0.15);
        }
        .form-control:focus {
          border-color: #5d5fef;
          box-shadow: 0 0 0 0.15rem rgba(93, 95, 239, 0.15);
          background: #f4f6fb !important;
          color: #000000 !important;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px -5px rgba(93, 95, 239, 0.25);
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
