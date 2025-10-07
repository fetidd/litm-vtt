import { Hero as LitmHero } from "../../litm/hero";
import Tag from "../Tag";
import BaseCard from "./BaseCard";
import Button from "../Button";

export default function HeroCard({
  hero,
  editing,
  setEditing,
  updateEntity,
  removeEntity,
  addModifier,
}: HeroCardProps) {
  const frontContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        {/* Hero name */}
        {editing === hero.id ? (
          <input
            type="text"
            value={hero.name}
            onChange={(e) => updateEntity({ ...hero, name: e.target.value })}
            style={{ fontSize: "2rem", textAlign: "center", border: "none", background: "transparent" }}
          />
        ) : (
          <div style={{ fontSize: "2rem", textAlign: "center" }}>
            {hero.name}
          </div>
        )}

        {/* Player name */}
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
        {editing === hero.id ? (
          <input
            type="text"
            value={hero.owner}
            onChange={(e) => updateEntity({ ...hero, owner: e.target.value })}
            style={{ textAlign: "center", border: "1px solid #ccc", padding: "4px" }}
          />
        ) : (
          <div style={{ textAlign: "center" }}>{hero.owner}</div>
        )}

        {/* Relationship tags */}
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
          {[...hero.relationships.entries()].map((value) => {
            const [name, tag] = value;
            return (
              <div
                key={tag.id}
                style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}
              >
                <div style={{ display: "flex" }}>
                  {editing === hero.id ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        const newRelationships = new Map(hero.relationships);
                        newRelationships.delete(name);
                        newRelationships.set(e.target.value, tag);
                        updateEntity({ ...hero, relationships: newRelationships });
                      }}
                      style={{ padding: "2px", width: "80px" }}
                    />
                  ) : (
                    <span>{name}</span>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Tag
                    tag={tag}
                    editing={editing === hero.id}
                    setEditing={setEditing}
                    updateEntity={updateEntity}
                    removeEntity={undefined}
                    addModifier={addModifier}
                    onCard={true}
                  />
                </div>
                {editing === hero.id && (
                  <Button onClick={() => {
                    const newRelationships = new Map(hero.relationships);
                    newRelationships.delete(name);
                    updateEntity({ ...hero, relationships: newRelationships });
                  }}>×</Button>
                )}
              </div>
            );
          })}
          {editing === hero.id && (
            <Button
              onClick={() => {
                const newTag = new (Tag as any)();
                newTag.name = "New Relationship";
                newTag.owner = hero.owner;
                newTag.id = Math.random().toString();
                const newRelationships = new Map(hero.relationships);
                newRelationships.set("New Person", newTag);
                updateEntity({ ...hero, relationships: newRelationships });
              }}
            >
              + Add Relationship
            </Button>
          )}
        </div>
      </div>

      {/* Promise */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "auto", marginBottom: "8px" }}>
        <h3>Promise</h3>
        {[...Array(hero.maxPromise).keys()].map((n) => {
          return (
            <input
              key={n}
              type="checkbox"
              disabled={editing !== hero.id}
              onChange={() => {
                if (editing === hero.id) {
                  const newValue = n < hero.promise ? n : n + 1;
                  updateEntity({ ...hero, promise: newValue });
                }
              }}
              checked={n < hero.promise}
            />
          );
        })}
      </div>

      {/* Quintessences */}
      <div>
        <h3
          style={{
            margin: "1px -12px",
            padding: "4px 12px",
            backgroundColor: "rgba(204, 165, 126, 0.43)",
            textAlign: "center",
          }}
        >
          Quintessences
        </h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[...(hero as any).quintessences || []].map((n, index) => {
            return editing === hero.id ? (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <input
                  type="text"
                  value={n || ""}
                  onChange={(e) => {
                    const newQuintessences = [...(hero as any).quintessences];
                    newQuintessences[index] = e.target.value;
                    updateEntity({ ...hero, quintessences: newQuintessences });
                  }}
                  style={{ padding: "4px", margin: "2px", flex: 1 }}
                  placeholder={`Quintessence ${index + 1}`}
                />
                <Button onClick={() => {
                  const newQuintessences = (hero as any).quintessences.filter((_: any, i: number) => i !== index);
                  updateEntity({ ...hero, quintessences: newQuintessences });
                }}>×</Button>
              </div>
            ) : (
              <span
                key={index}
                style={{ padding: "4px" }}
              >{n || ""}</span>
            );
          })}
          {editing === hero.id && (
            <Button
              onClick={() => {
                const quintessences = (hero as any).quintessences || [];
                updateEntity({ ...hero, quintessences: [...quintessences, ""] });
              }}
            >
              + Add Quintessence
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        {/* Backpack */}
        <h3 style={{ margin: "1px -12px", padding: "4px 12px", backgroundColor: "rgba(204, 165, 126, 0.43)", textAlign: "center" }}>Backpack</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {hero.backpack.map((tag) => {
            return (
              <div key={tag.id} style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                <Tag
                  tag={tag}
                  editing={editing === hero.id}
                  setEditing={setEditing}
                  updateEntity={updateEntity}
                  removeEntity={undefined}
                  addModifier={addModifier}
                  onCard={true}
                />
                {editing === hero.id && (
                  <Button onClick={() => updateEntity({ ...hero, backpack: hero.backpack.filter(t => t.id !== tag.id) })}>×</Button>
                )}
              </div>
            );
          })}
          {editing === hero.id && (
            <Button
              onClick={() => {
                const newTag = new (Tag as any)();
                newTag.name = "New Item";
                newTag.owner = hero.owner;
                newTag.id = Math.random().toString();
                updateEntity({ ...hero, backpack: [...hero.backpack, newTag] });
              }}
            >
              + Add Item
            </Button>
          )}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginTop: "auto" }}>
        <h3 style={{ margin: "1px -12px", padding: "4px 12px", backgroundColor: "rgba(204, 165, 126, 0.43)", textAlign: "center" }}>Notes</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[...(hero as any).notes || []].map((n, index) => {
            return editing === hero.id ? (
              <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "4px", marginBottom: "4px" }}>
                <textarea
                  value={n || ""}
                  onChange={(e) => {
                    const newNotes = [...(hero as any).notes];
                    newNotes[index] = e.target.value;
                    updateEntity({ ...hero, notes: newNotes });
                  }}
                  style={{ padding: "4px", resize: "vertical", minHeight: "40px", flex: 1 }}
                  placeholder={`Note ${index + 1}`}
                />
                <Button onClick={() => {
                  const newNotes = (hero as any).notes.filter((_: any, i: number) => i !== index);
                  updateEntity({ ...hero, notes: newNotes });
                }}>×</Button>
              </div>
            ) : (
              <span
                key={index}
                style={{ padding: "4px" }}
              >{n || ""}</span>
            );
          })}
          {editing === hero.id && (
            <Button
              onClick={() => {
                const notes = (hero as any).notes || [];
                updateEntity({ ...hero, notes: [...notes, ""] });
              }}
            >
              + Add Note
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <BaseCard
      title="HERO"
      headerColor="rgba(122, 79, 61, 1)"
      entityId={hero.id}
      editing={editing}
      setEditing={setEditing}
      frontContent={frontContent}
      backContent={backContent}
    />
  );
}

interface HeroCardProps {
  hero: LitmHero;
  editing: string | undefined;
  setEditing: any;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
}