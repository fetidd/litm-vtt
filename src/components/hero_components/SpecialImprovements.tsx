import { useState } from "react";
import Button from "@/components/ui/Button";

interface SpecialImprovementsProps {
  specialImprovements: string[];
  onUpdate: (specialImprovements: string[]) => void;
}

export default function SpecialImprovements({
  specialImprovements,
  onUpdate,
}: SpecialImprovementsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  return (
    <>
      <h3
        style={{
          margin: "1px -12px",
          padding: "4px 12px",
          backgroundColor: "rgba(204, 165, 126, 0.43)",
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Special Improvements
        <Button onClick={() => {
          onUpdate([...specialImprovements, "New Improvement: Description"]);
          setEditingIndex(specialImprovements.length);
        }} style={{ fontSize: "12px", padding: "2px 6px" }}>+</Button>
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {specialImprovements.map((imp: string, index: number) => {
          const [name, description] = imp.split(": ");
          if (editingIndex === index) {
            return (
              <div key={index} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <input
                  type="text"
                  value={name || ""}
                  onChange={(e) => {
                    const newImps = [...specialImprovements];
                    newImps[index] = `${e.target.value}: ${description || ""}`;
                    onUpdate(newImps);
                  }}
                  placeholder="Name"
                  style={{ padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <textarea
                  value={description || ""}
                  onChange={(e) => {
                    const newImps = [...specialImprovements];
                    newImps[index] = `${name || ""}: ${e.target.value}`;
                    onUpdate(newImps);
                  }}
                  placeholder="Description"
                  rows={Math.max(5, (description || "").split('\n').length)}
                  style={{ padding: "4px", border: "1px solid #ccc", borderRadius: "4px", resize: "vertical", fontFamily: "inherit" }}
                />
                <Button onClick={() => setEditingIndex(null)}>Done</Button>
              </div>
            );
          }
          return (
            <span
              key={index}
              style={{ padding: "4px", cursor: "pointer" }}
              title={description}
              onClick={() => setEditingIndex(index)}
            >
              {name}
            </span>
          );
        })}

      </div>
    </>
  );
}
