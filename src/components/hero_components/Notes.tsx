import { useState } from "react";
import Button from "@/components/ui/Button";
import { createPortal } from "react-dom";
import { dialogStyles } from "@/styles/dialogStyles";

interface NotesProps {
  notes: string[];
  onUpdate: (notes: string[]) => void;
}

export default function Notes({
  notes,
  onUpdate,
}: NotesProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [tempNotes, setTempNotes] = useState<string[]>([]);
  
  const openDialog = () => {
    setTempNotes([...notes]);
    setShowDialog(true);
  };
  
  return (
    <div style={{ marginTop: "auto" }}>
      <h3 
        style={{ 
          margin: "1px -12px", 
          padding: "4px 12px", 
          backgroundColor: "rgba(204, 165, 126, 0.43)", 
          textAlign: "center",
          cursor: "pointer"
        }}
        onClick={openDialog}
      >
        Notes
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {notes.map((note, index) => (
          <div key={index} style={{ padding: "4px", fontSize: "0.9rem" }}>
            {note.substring(0, 50)}{note.length > 50 ? "..." : ""}
          </div>
        ))}
      </div>
      {showDialog && createPortal(
        <div style={{
          ...dialogStyles.dialog,
          width: "400px",
          maxHeight: "70vh",
          overflow: "auto"
        }}>
          <h3 style={dialogStyles.dialogTitle}>Edit Notes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {tempNotes.map((note, index) => (
              <textarea
                key={index}
                value={note}
                onChange={(e) => {
                  const newTempNotes = [...tempNotes];
                  newTempNotes[index] = e.target.value;
                  setTempNotes(newTempNotes);
                }}
                style={{
                  ...dialogStyles.textarea,
                  minHeight: "60px"
                }}
                placeholder="Enter note..."
              />
            ))}
            <button
              onClick={() => setTempNotes([...tempNotes, ""])}
              style={{
                ...dialogStyles.secondaryButton,
                padding: "4px 8px"
              }}
            >
              Add Note
            </button>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => {
                onUpdate(tempNotes);
                setShowDialog(false);
              }}
              style={dialogStyles.primaryButton}
            >
              Save
            </button>
            <button
              onClick={() => setShowDialog(false)}
              style={dialogStyles.secondaryButton}
            >
              Cancel
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}