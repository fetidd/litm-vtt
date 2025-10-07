import { useState } from "react";

interface PromiseProps {
  promise: number;
  maxPromise: number;
  onUpdate: (value: number) => void;
}

export default function Promise({ promise, maxPromise, onUpdate }: PromiseProps) {
  const [editing, setEditing] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "auto", marginBottom: "8px" }}>
      <h3>Promise</h3>
      {[...Array(maxPromise).keys()].map((n) => (
        <input
          key={n}
          type="checkbox"
          disabled={!editing}
          onChange={() => {
            if (editing) {
              const newValue = n < promise ? n : n + 1;
              onUpdate(newValue);
            }
          }}
          checked={n < promise}
        />
      ))}
    </div>
  );
}