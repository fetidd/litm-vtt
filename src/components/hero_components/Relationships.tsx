import Tag from "@/components/game_entities/Tag";
import Button from "@/components/ui/Button";
import { useState } from "react";

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
  const [editing, setEditing] = useState(undefined);
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
        Fellowship Relationship
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
                {editing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const newRelationships = new Map(relationships);
                      newRelationships.delete(name);
                      newRelationships.set(e.target.value, tag);
                      onUpdate(newRelationships);
                    }}
                    style={{ padding: "2px", width: "60px" }}
                  />
                ) : (
                  <span style={{ fontSize: "0.9rem" }}>{name}</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Tag
                  tag={tag}
                  editing={editing == tag.id}
                  setEditing={setEditing}
                  updateEntity={updateEntity}
                  removeEntity={undefined}
                  addModifier={addModifier}
                  onCard={true}
                />
              </div>
              {editing && (
                <Button onClick={() => {
                  const newRelationships = new Map(relationships);
                  newRelationships.delete(name);
                  onUpdate(newRelationships);
                }}>×</Button>
              )}
            </div>
          );
        })}
        {editing && (
          <Button
            onClick={() => {
              const newTag = new (Tag as any)();
              newTag.name = "New Relationship";
              newTag.owner = owner;
              newTag.id = Math.random().toString();
              const newRelationships = new Map(relationships);
              newRelationships.set("New Person", newTag);
              onUpdate(newRelationships);
            }}
          >
            + Add Relationship
          </Button>
        )}
      </div>
    </>
  );
}