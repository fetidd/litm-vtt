import { useState } from "react";
import Button from "@/components/ui/Button";

interface NotesProps {
  notes: string[];
  onUpdate: (notes: string[]) => void;
}

export default function Notes({
  notes,
  onUpdate,
}: NotesProps) {
  return (
    <div style={{ marginTop: "auto" }}>
      <h3 style={{ margin: "1px -12px", padding: "4px 12px", backgroundColor: "rgba(204, 165, 126, 0.43)", textAlign: "center" }}>Notes</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {notes.map((n, index) =>
          (
            <span key={index} style={{ padding: "4px" }}>{n || ""}</span>
          )
        )}
      </div>
    </div>
  );
}