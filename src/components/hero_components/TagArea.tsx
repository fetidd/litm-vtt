import { Tag as LitmTag } from "@/litm/tag";
import Tag from "@/components/game_entities/Tag";
import Button from "@/components/ui/Button";
import TagEditDialog from "@/components/ui/TagEditDialog";
import { useState } from "react";
import { createPortal } from "react-dom";
import constants from "@/constants";
import { Entity } from "@/litm/entity";

interface TagAreaProps {
  otherTags: any[];
  weaknessTags: any[];
  updateEntity: any;
  addModifier: any;
}

export default function TagArea({
  otherTags,
  weaknessTags,
  updateEntity,
  addModifier,
}: TagAreaProps) {
  const [editingTag, setEditingTag] = useState<{
    tag: LitmTag;
    position: { x: number; y: number };
    kind: "other-tag" | "weakness-tag";
  } | null>(null);
  return (
    <>
      {otherTags.map((tag: any) => (
        <div
          key={tag.id}
          style={{
            marginBottom: "4px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Tag
            tag={tag}
            updateEntity={updateEntity}
            removeEntity={undefined}
            addModifier={addModifier}
            onCard={true}
            onShowEditDialog={(position) =>
              setEditingTag({ tag, position, kind: "other-tag" })
            }
          />
        </div>
      ))}
      {weaknessTags.map((tag: LitmTag, index: number) => (
        <div
          key={tag.id}
          style={{
            marginBottom: "4px",
            ...(index === 0 ? { marginTop: "8px" } : {}),
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Tag
            tag={tag}
            updateEntity={updateEntity}
            isWeakness={true}
            removeEntity={undefined}
            addModifier={addModifier}
            onCard={true}
            onShowEditDialog={(position) =>
              setEditingTag({ tag, position, kind: "weakness-tag" })
            }
          />
        </div>
      ))}
      {editingTag &&
        createPortal(
          // TODO remove the debug span
          <>
            <span
              style={{
                position: "fixed",
                color: "red",
                backgroundColor: "white",
                padding: "4px",
                borderRadius: "4px",
                left: editingTag.position.x,
                top: editingTag.position.y - 30,
              }}
            >
              {editingTag.tag.id}
            </span>
            <TagEditDialog
              tag={editingTag.tag}
              position={editingTag.position}
              onSave={(name, isPublic) => {
                updateEntity(
                  { entityId: editingTag.tag.id, entityType: editingTag.kind },
                  (tag: LitmTag) => {
                    tag.name = name;
                    return tag;
                  },
                );
                setEditingTag(null);
              }}
              onCancel={() => setEditingTag(null)}
              isOwner={true}
            />
          </>,
          document.body,
        )}
    </>
  );
}
