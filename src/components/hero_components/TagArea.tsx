import { Tag as LitmTag } from "@/litm/tag";
import Tag from "@/components/game_entities/Tag";
import Button from "@/components/ui/Button";
import TagEditDialog from "@/components/ui/TagEditDialog";
import { useState } from "react";
import { createPortal } from "react-dom";

interface TagAreaProps {
  otherTags: any[];
  weaknessTags: any[];
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
  const [editingTag, setEditingTag] = useState<{ tag: any; position: { x: number; y: number } } | null>(null);
  return (
    <>
      {otherTags.map((tag: any) => (
        <div key={tag.id} style={{ marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
          <Tag
            tag={tag}
            updateEntity={updateEntity}
            removeEntity={undefined}
            addModifier={addModifier}
            onCard={true}
            onShowEditDialog={(position) => setEditingTag({ tag, position })}
          />
        </div>
      ))}
      {weaknessTags.map((tag: any, index: number) => (
        <div key={tag.id} style={{ marginBottom: "4px", ...(index === 0 ? { marginTop: "8px" } : {}), display: "flex", alignItems: "center", gap: "4px" }}>
          <Tag
            tag={tag}
            updateEntity={updateEntity}
            isWeakness={true}
            removeEntity={undefined}
            addModifier={addModifier}
            onCard={true}
            onShowEditDialog={(position) => setEditingTag({ tag, position })}
          />
        </div>
      ))}
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
    </>
  );
}