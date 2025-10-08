import { Tag as LitmTag } from "@/litm/tag";
import Tag from "@/components/game_entities/Tag";
import Button from "@/components/ui/Button";
import { useState } from "react";

interface TagAreaProps {
  otherTags: any[];
  weaknessTags: any[];
  setEditing: any;
  updateEntity: any;
  addModifier: any;
  owner: string;
  onUpdate: (otherTags: any[], weaknessTags: any[]) => void;
}

export default function TagArea({ 
  otherTags, 
  weaknessTags, 
  updateEntity, 
  addModifier,
  owner,
  onUpdate
}: TagAreaProps) {
  const [editing, setEditing] = useState(false);
  return (
    <>
      {otherTags.map((tag: any) => (
        <div key={tag.id} style={{ marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
          <Tag
            tag={tag}
            setEditing={setEditing}
            updateEntity={updateEntity}
            removeEntity={undefined}
            addModifier={addModifier}
            onCard={true}
          />
        </div>
      ))}
      {weaknessTags.map((tag: any, index: number) => (
        <div key={tag.id} style={{ marginBottom: "4px", ...(index === 0 ? { marginTop: "8px" } : {}), display: "flex", alignItems: "center", gap: "4px" }}>
          <Tag
            tag={tag}
            setEditing={setEditing}
            updateEntity={updateEntity}
            isWeakness={true}
            removeEntity={undefined}
            addModifier={addModifier}
            onCard={true}
          />
        </div>
      ))}
    </>
  );
}