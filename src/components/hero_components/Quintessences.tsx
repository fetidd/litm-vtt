import { useState } from "react";
import Button from "@/components/ui/Button";

interface QuintessencesProps {
  quintessences: string[];
  onUpdate: (quintessences: string[]) => void;
}

export default function Quintessences({
  quintessences,
  onUpdate,
}: QuintessencesProps) {
  const [editing, setEditing] = useState(false);
  return (
    <div>
      <h3
        style={{
          margin: "1px -12px",
          padding: "4px 12px",
          backgroundColor: "rgba(204, 165, 126, 0.43)",
          textAlign: "center",
        }}
      >
        Quintessences
      </h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {quintessences.map((n, index) =>
          editing ? (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                type="text"
                value={n || ""}
                onChange={(e) => {
                  const newQuintessences = [...quintessences];
                  newQuintessences[index] = e.target.value;
                  onUpdate(newQuintessences);
                }}
                style={{ padding: "4px", margin: "2px", flex: 1 }}
                placeholder={`Quintessence ${index + 1}`}
              />
              <Button onClick={() => onUpdate(quintessences.filter((_, i) => i !== index))}>×</Button>
            </div>
          ) : (
            <span key={index} style={{ padding: "4px" }}>{n || ""}</span>
          )
        )}
        {editing && (
          <Button onClick={() => onUpdate([...quintessences, ""])}>
            + Add Quintessence
          </Button>
        )}
      </div>
    </div>
  );
}