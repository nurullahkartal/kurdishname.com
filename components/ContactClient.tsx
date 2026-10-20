"use client";

import React, { useState } from "react";

export interface ContactLabels {
  contact_title: string;
  contact_desc: string;
  contact_email_label: string;
  contact_name: string;
  contact_name_ph: string;
  contact_email: string;
  contact_email_ph: string;
  contact_msg: string;
  contact_msg_ph: string;
  contact_submit: string;
  contact_success: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  border: "1px solid var(--border)",
  borderRadius: "var(--r-md)",
  background: "var(--surface)",
  fontSize: "0.9rem",
  color: "var(--text)",
  outline: "none",
};

export default function ContactClient({ labels }: { labels: ContactLabels }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<null | "success">(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("success");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ maxWidth: "540px" }}>
      <h1 className="page-title">{labels.contact_title}</h1>
      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        {labels.contact_desc} {labels.contact_email_label}{" "}
        <a href="mailto:info@kurdishname.com" style={{ color: "var(--accent)" }}>
          info@kurdishname.com
        </a>
      </p>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--r-xl)",
          background: "var(--surface)",
          padding: "1.5rem",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "0.375rem",
              }}
            >
              {labels.contact_name}
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={inputStyle}
              placeholder={labels.contact_name_ph}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "0.375rem",
              }}
            >
              {labels.contact_email}
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
              placeholder={labels.contact_email_ph}
            />
          </div>

          <div>
            <label
              htmlFor="message"
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "0.375rem",
              }}
            >
              {labels.contact_msg}
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
              placeholder={labels.contact_msg_ph}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "var(--text)",
              color: "var(--surface)",
              border: "none",
              borderRadius: "var(--r-md)",
              fontSize: "0.875rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {labels.contact_submit}
          </button>

          {status === "success" && (
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(34,197,94,0.07)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: "var(--r-md)",
                fontSize: "0.875rem",
                color: "#15803D",
                fontWeight: 600,
              }}
            >
              ✓ {labels.contact_success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
