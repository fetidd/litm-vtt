import React, { useState } from "react";
import { Status as LitmStatus } from "@/litm/status";
import EntityEditDialog from "./EntityEditDialog";

interface StatusEditDialogProps {
  status: LitmStatus;
  position: { x: number; y: number };
  onSave: (name: string, tiers: number[], isPublic: boolean) => void;
  onCancel: () => void;
  isOwner?: boolean;
}

export default function StatusEditDialog({ status, position, onSave, onCancel, isOwner = false }: StatusEditDialogProps) {
  const [tiers, setTiers] = useState(status.tiers);

  const toggleTier = (t: number) => {
    if (tiers.includes(t)) {
      setTiers(tiers.filter(tier => tier !== t));
    } else {
      setTiers([...tiers, t].sort());
    }
  };

  return (
    <EntityEditDialog
      position={position}
      onSave={(name, isPublic) => onSave(name, tiers, isPublic)}
      onCancel={onCancel}
      initialName={status.name}
      showPublicCheckbox={isOwner}
    >
      <div style={{ marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <label style={{ fontSize: "12px" }}>Tier:</label>
          <button
            onClick={() => {
              setTiers(tiers.map(t => t - 1).filter(t => t > 0));
            }}
            disabled={tiers.length === 0}
            style={{
              padding: "2px 6px",
              background: tiers.length > 0 ? "#f44336" : "#666",
              color: "white",
              border: "none",
              borderRadius: "2px",
              cursor: tiers.length > 0 ? "pointer" : "not-allowed",
              fontSize: "10px",
            }}
          >
            Decrease
          </button>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {[1, 2, 3, 4, 5, 6].map((t) => (
            <button
              key={t}
              onClick={() => toggleTier(t)}
              style={{
                padding: "4px 8px",
                background: tiers.includes(t) ? "#68ff03ff" : "#555",
                color: tiers.includes(t) ? "black" : "white",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </EntityEditDialog>
  );
}