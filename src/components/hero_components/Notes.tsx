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
  const [editing, setEditing] = useState(false);
  return (
    <div style={{ marginTop: "auto" }}>
      <h3 style={{ margin: "1px -12px", padding: "4px 12px", backgroundColor: "rgba(204, 165, 126, 0.43)", textAlign: "center" }}>Notes</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {notes.map((n, index) =>
          editing ? (
            <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "4px", marginBottom: "4px" }}>
              <textarea
                value={n || ""}
                onChange={(e) => {
                  const newNotes = [...notes];
                  newNotes[index] = e.target.value;
                  onUpdate(newNotes);
                }}
                style={{ padding: "4px", resize: "vertical", minHeight: "40px", flex: 1 }}
                placeholder={`Note ${index + 1}`}
              />
              <Button onClick={() => onUpdate(notes.filter((_, i) => i !== index))}>×</Button>
            </div>
          ) : (
            <span key={index} style={{ padding: "4px" }}>{n || ""}</span>
          )
        )}
        {editing && (
          <Button onClick={() => onUpdate([...notes, ""])}>
            + Add Note
          </Button>
        )}
      </div>
    </div>
  );
}