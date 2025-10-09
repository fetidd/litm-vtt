import { useState } from "react";

interface PlayerNameProps {
  owner: string;
  onUpdate: (owner: string) => void;
}

export default function PlayerName({
  owner,
  onUpdate,
}: PlayerNameProps) {
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
      {(
        <div style={{ textAlign: "center" }}>{owner}</div>
      )}
    </>
  );
}