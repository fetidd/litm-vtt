import React, { useState, useRef, useEffect } from "react";
import BaseEditDialog from "./BaseEditDialog";
import type { ThemeType } from "@/litm/theme";
import type { Might } from "@/litm/might";

interface ThemeEditDialogProps {
  position: { x: number; y: number };
  onSave: (themeType: ThemeType, might: Might) => void;
  onCancel: () => void;
  initialThemeType?: ThemeType;
  initialMight?: Might;
}

const THEME_TYPES: ThemeType[] = [
  "circumstance", "devotion", "people", "past", "personality", "trait", "skill/trade",
  "duty", "influence", "knowledge", "prodigious ability", "relic", "uncanny being",
  "destiny", "dominion", "mastery", "monstrosity",
  "companion", "magic", "possession"
];

const MIGHT_OPTIONS: Might[] = ["origin", "adventure", "greatness"];

export default function ThemeEditDialog({ 
  position, 
  onSave, 
  onCancel, 
  initialThemeType,
  initialMight = "origin"
}: ThemeEditDialogProps) {
  const [themeType, setThemeType] = useState<ThemeType | "">(initialThemeType || "");
  const [might, setMight] = useState<Might>(initialMight);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (themeType) {
        onSave(themeType as ThemeType, might);
      }
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <BaseEditDialog
      position={position}
      onSave={() => {
        if (themeType) {
          onSave(themeType as ThemeType, might);
        }
      }}
      onCancel={onCancel}
    >
      <div style={{ marginBottom: "8px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "white" }}>
          Theme Type:
        </label>
        <select
          value={themeType}
          onChange={(e) => setThemeType(e.target.value as ThemeType)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            padding: "4px",
            background: "#222",
            border: "1px solid #555",
            borderRadius: "2px",
            color: "white",
            fontSize: "12px"
          }}
          autoFocus
        >
          <option value="">Select theme type...</option>
          {THEME_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "white" }}>
          Might:
        </label>
        <select
          value={might}
          onChange={(e) => setMight(e.target.value as Might)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            padding: "4px",
            background: "#222",
            border: "1px solid #555",
            borderRadius: "2px",
            color: "white",
            fontSize: "12px"
          }}
        >
          {MIGHT_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </BaseEditDialog>
  );
}