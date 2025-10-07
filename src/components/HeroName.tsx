import { useState } from "react";

interface HeroNameProps {
  name: string;
  onUpdate: (name: string) => void;
}

export default function HeroName({
  name,
  onUpdate,
}: HeroNameProps) {
  const [editing, setEditing] = useState(false);
  return editing ? (
    <input
      type="text"
      value={name}
      onChange={(e) => onUpdate(e.target.value)}
      style={{ fontSize: "2rem", textAlign: "center", border: "none", background: "transparent" }}
    />
  ) : (
    <div style={{ fontSize: "2rem", textAlign: "center" }}>
      {name}
    </div>
  );
}