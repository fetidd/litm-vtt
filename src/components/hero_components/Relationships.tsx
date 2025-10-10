import Tag from "@/components/game_entities/Tag";
import Button from "@/components/ui/Button";
import TagEditDialog from "@/components/ui/TagEditDialog";
import { Item, ContextMenuWrapper } from "@/components/ui/ContextMenu";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Tag as TagEntity } from "@/litm/tag";
import { dialogStyles } from "@/styles/dialogStyles";

interface RelationshipsProps {
  relationships: Map<string, any>;
  updateEntity: any;
  addModifier: any;
  owner: string;
  onUpdate: (relationships: Map<string, any>) => void;
}

export default function Relationships({
  relationships,
  updateEntity,
  addModifier,
  owner,
  onUpdate,
}: RelationshipsProps) {
  const [editingTag, setEditingTag] = useState<{ tag: any; position: { x: number; y: number } } | null>(null);
  const [editingName, setEditingName] = useState<{ name: string; tag: any; position: { x: number; y: number } } | null>(null);
  return (
    <>
      <h3 style={dialogStyles.sectionHeader}>
        Fellowship Relationship
        <Button onClick={() => {
          const newTag = TagEntity.blank();
          newTag.name = "New Relationship";
          newTag.owner = owner;
          const newRelationships = new Map(relationships);
          newRelationships.set("New Name", newTag);
          onUpdate(newRelationships);
        }} style={{ fontSize: "12px", padding: "2px 6px" }}>+</Button>
      </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {[...relationships.entries()].map((value) => {
          const [name, tag] = value;
          return (
            <div
              key={tag.id}
              style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}
            >
              <div style={{ minWidth: "60px" }}>
                <ContextMenuWrapper 
                  menu={
                    <Item onClick={(params) => {
                      const x = params?.triggerEvent?.clientX || 200;
                      const y = params?.triggerEvent?.clientY || 100;
                      setEditingName({ name, tag, position: { x: x + 8, y } });
                    }}>
                      <PencilIcon style={{ width: "16px", height: "16px", marginRight: "8px" }} />
                      Edit Name
                    </Item>
                  }
                >
                  <span style={{ fontSize: "0.9rem", cursor: "pointer" }}>{name}</span>
                </ContextMenuWrapper>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Tag
                  tag={tag}
                  updateEntity={updateEntity}
                  removeEntity={undefined}
                  addModifier={addModifier}
                  onCard={true}
                  onShowEditDialog={(position) => setEditingTag({ tag, position })}
                />
              </div>
            </div>
          );
        })}

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
      {editingName && createPortal(
        <TagEditDialog
          tag={{ name: editingName.name }}
          position={editingName.position}
          onSave={(newName, isPublic) => {
            const newRelationships = new Map(relationships);
            const tag = newRelationships.get(editingName.name);
            if (tag) {
              newRelationships.delete(editingName.name);
              newRelationships.set(newName, tag);
              onUpdate(newRelationships);
            }
            setEditingName(null);
          }}
          onCancel={() => setEditingName(null)}
          isOwner={true}
        />,
        document.body,
      )}
    </>
  );
}