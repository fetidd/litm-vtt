import React, { useState, useEffect, useRef } from "react";

interface BaseEditDialogProps {
  position: { x: number; y: number };
  onSave: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export default function BaseEditDialog({
  position,
  onSave,
  onCancel,
  children,
}: BaseEditDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCancel]);

  return (
    <div
      ref={dialogRef}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        background: "#333",
        border: "2px solid #68ff03ff",
        borderRadius: "4px",
        padding: "12px",
        zIndex: 10000,
        minWidth: "200px",
        color: "white",
        userSelect: "none",
      }}
    >
      {children}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={onSave}
          style={{
            padding: "4px 12px",
            background: "#68ff03ff",
            color: "black",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "4px 12px",
            background: "#666",
            color: "white",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}