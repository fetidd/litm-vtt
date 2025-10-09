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
          (
            <span key={index} style={{ padding: "4px" }}>{n || ""}</span>
          )
        )}
      </div>
    </div>
  );
}