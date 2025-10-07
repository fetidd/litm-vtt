import { useState } from "react";
import Button from "./Button";

interface SpecialImprovementsProps {
  specialImprovements: string[];
  onUpdate: (specialImprovements: string[]) => void;
}

export default function SpecialImprovements({
  specialImprovements,
  onUpdate,
}: SpecialImprovementsProps) {
  const [editing, setEditing] = useState(false);
  return (
    <>
      <h3
        style={{
          margin: "1px -12px",
          padding: "4px 12px",
          backgroundColor: "rgba(204, 165, 126, 0.43)",
          textAlign: "center",
        }}
      >
        Special Improvements
      </h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {specialImprovements.map((imp: string, n: number) =>
          editing ? (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                type="text"
                value={imp}
                onChange={(e) => {
                  const newImprovements = [...specialImprovements];
                  newImprovements[n] = e.target.value;
                  onUpdate(newImprovements);
                }}
                style={{ padding: "4px", margin: "2px", flex: 1 }}
              />
              <Button onClick={() => onUpdate(specialImprovements.filter((_, i) => i !== n))}>×</Button>
            </div>
          ) : (
            <span key={n} style={{ padding: "4px" }}>
              {imp}
            </span>
          )
        )}
        {editing && (
          <Button onClick={() => onUpdate([...specialImprovements, ""])}>
            + Add Improvement
          </Button>
        )}
      </div>
    </>
  );
}