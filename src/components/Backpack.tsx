import Tag from "./Tag";
import Button from "./Button";
import { useState } from "react";

interface BackpackProps {
  backpack: any[];
  updateEntity: any;
  addModifier: any;
  owner: string;
  onUpdate: (backpack: any[]) => void;
}

export default function Backpack({
  backpack,
  updateEntity,
  addModifier,
  owner,
  onUpdate,
}: BackpackProps) {
  const [editing, setEditing] = useState(false);
  return (
    <>
      <h3 style={{ margin: "1px -12px", padding: "4px 12px", backgroundColor: "rgba(204, 165, 126, 0.43)", textAlign: "center" }}>Backpack</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {backpack.map((tag) => (
          <div key={tag.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Tag
              tag={tag}
              editing={editing}
              setEditing={setEditing}
              updateEntity={updateEntity}
              removeEntity={undefined}
              addModifier={addModifier}
              onCard={true}
            />
          </div>
        ))}
      </div>
    </>
  );
}