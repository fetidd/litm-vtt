import { useState } from "react";
import Button from "@/components/ui/Button";
import { Tag as TagEntity } from "@/litm/tag";
import Tag from "@/components/game_entities/Tag";
import TagEditDialog from "@/components/ui/TagEditDialog";
import { createPortal } from "react-dom";

interface QuintessencesProps {
  quintessences: any[];
  updateEntity: any;
  addModifier: any;
  owner: string;
  onUpdate: (quintessences: any[]) => void;
}

export default function Quintessences({
  quintessences,
  updateEntity,
  addModifier,
  owner,
  onUpdate,
}: QuintessencesProps) {
  const [editingTag, setEditingTag] = useState<{ tag: any; position: { x: number; y: number } } | null>(null);
  return (
    <div>
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
        Quintessences
        <Button onClick={() => {
          const newTag = TagEntity.blank();
          newTag.name = "New Quintessence";
          newTag.owner = owner;
          onUpdate([...quintessences, newTag]);
        }} style={{ fontSize: "12px", padding: "2px 6px" }}>+</Button>
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {quintessences.map((tag, index) => (
          <Tag
            key={tag.id || index}
            tag={tag}
            updateEntity={updateEntity}
            removeEntity={undefined}
            addModifier={addModifier}
            onCard={true}
            onShowEditDialog={(position) => setEditingTag({ tag, position })}
          />
        ))}

      </div>
      {editingTag && createPortal(
        <TagEditDialog
          tag={editingTag.tag}
          position={editingTag.position}
          onSave={(name, isPublic) => {
            updateEntity(editingTag.tag.id, (tag: any) => {
              tag.name = name;
              return tag;
            });
            setEditingTag(null);
          }}
          onCancel={() => setEditingTag(null)}
          isOwner={true}
        />,
        document.body,
      )}
    </div>
  );
}