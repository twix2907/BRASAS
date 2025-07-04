import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.45)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#232323",
        borderRadius: 16,
        minWidth: 320,
        maxWidth: 420,
        width: "90vw",
        padding: "2rem 1.5rem 1.5rem 1.5rem",
        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18)",
        position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            color: "#ffd203",
            fontSize: 22,
            cursor: "pointer",
            fontWeight: 700,
          }}
          aria-label="Cerrar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
