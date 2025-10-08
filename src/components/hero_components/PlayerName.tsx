import { useState } from "react";

interface PlayerNameProps {
  owner: string;
  onUpdate: (owner: string) => void;
}

export default function PlayerName({
  owner,
  onUpdate,
}: PlayerNameProps) {
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
        Player Name
      </h3>
      {editing ? (
        <input
          type="text"
          value={owner}
          onChange={(e) => onUpdate(e.target.value)}
          style={{ textAlign: "center", border: "1px solid #ccc", padding: "4px" }}
        />
      ) : (
        <div style={{ textAlign: "center" }}>{owner}</div>
      )}
    </>
  );
}