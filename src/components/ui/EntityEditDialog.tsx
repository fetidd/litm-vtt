import React, { useState, useRef, useEffect } from "react";
import BaseEditDialog from "./BaseEditDialog";

interface EntityEditDialogProps {
  position: { x: number; y: number };
  onSave: (name: string, isPublic: boolean) => void;
  onCancel: () => void;
  initialName: string;
  showPublicCheckbox?: boolean;
  children?: React.ReactNode;
}

export default function EntityEditDialog({ 
  position, 
  onSave, 
  onCancel, 
  initialName, 
  showPublicCheckbox = false,
  children 
}: EntityEditDialogProps) {
  const [name, setName] = useState(initialName);
  const [isPublic, setIsPublic] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (name.trim()) {
        onSave(name.trim(), isPublic);
      }
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <BaseEditDialog
      position={position}
      onSave={() => {
        if (name.trim()) {
          onSave(name.trim(), isPublic);
        }
      }}
      onCancel={onCancel}
    >
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          padding: "4px",
          marginBottom: "8px",
          background: "#222",
          border: "1px solid #555",
          borderRadius: "2px",
          color: "white",
        }}
      />
      {children}
      {showPublicCheckbox && (
        <label style={{ display: "flex", alignItems: "center", marginBottom: "8px", fontSize: "12px" }}>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            style={{ marginRight: "6px" }}
          />
          Public (anyone can use)
        </label>
      )}
    </BaseEditDialog>
  );
}