"use client";

import { useState } from "react";

export default function EnquiryModal({ open, onClose, property }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    ok: false,
    error: "",
  });

  if (!open) return null;

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ loading: true, ok: false, error: "" });

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          propertyId: property?.id,
          propertyTitle: property?.title,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to submit enquiry");

      setStatus({ loading: false, ok: true, error: "" });
      setForm({ name: "", mobile: "", email: "", message: "" });
    } catch (err) {
      setStatus({ loading: false, ok: false, error: err.message || "Error" });
    }
  }

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h3>Send Enquiry</h3>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="small" style={{ marginTop: 8 }}>
          {property ? (
            <>
              For: <b>{property.title}</b>
            </>
          ) : (
            "General enquiry"
          )}
        </div>

        <form
          onSubmit={submit}
          style={{ marginTop: 12, display: "grid", gap: 10 }}
        >
          <input
            className="input"
            placeholder="Name*"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
          />
          <input
            className="input"
            placeholder="Mobile*"
            value={form.mobile}
            onChange={(e) => setField("mobile", e.target.value)}
          />
          <input
            className="input"
            placeholder="Email*"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
          />
          <textarea
            className="input"
            rows={4}
            placeholder="Message"
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
          />

          {status.error ? (
            <div style={{ color: "var(--danger)" }}>{status.error}</div>
          ) : null}
          {status.ok ? (
            <div style={{ color: "var(--accent)" }}>
              Enquiry submitted successfully.
            </div>
          ) : null}

          <button className="btn btnPrimary" disabled={status.loading}>
            {status.loading ? "Submitting..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
