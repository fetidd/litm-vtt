import constants, { CARD_STYLE } from "@/constants";
import { Hero as LitmHero } from "../../litm/hero";
import { useState } from "react";
import { Theme } from "@/litm/theme";
import Tag from "../Tag";
import type { Entity } from "@/litm/entity";

export default function HeroCard({
  hero,
  editing,
  setEditing,
  updateEntity,
  removeEntity,
  addModifier,
}: HeroCardProps) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setSide(side === "front" ? "back" : "front");
      setTimeout(() => setIsFlipping(false), 50);
    }, 50);
  };

  return (
    <div style={{
      ...CARD_STYLE,
      transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
      transition: 'transform 0.1s linear'
    }}>
      <div
        style={{
          display: "flex",
          height: "40px",
          background: "rgba(122, 79, 61, 1)",
          color: "white",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 8px",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>HERO</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleFlip}
            style={{
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            Flip
          </button>
          <button
            onClick={() => setEditing(editing === hero.id ? undefined : hero.id)}
            style={{
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            {editing === hero.id ? "Done" : "Edit"}
          </button>
        </div>
      </div>
      {side == "front" && !isFlipping && (
        <>
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
              margin: "1px",
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
              margin: "1px",
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
                  style={{ display: "flex", justifyContent: "space-around" }}
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
                    {/* <div
                                        className="placeholder-relationship-tag"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            background: "transparent",
                                            border: "1px solid #9b5424ff",
                                            borderRadius: "4px",
                                            minWidth: "80px",
                                            height: "30px",
                                            alignContent: "center",
                                        }}
                                    ></div> */}
                    <Tag
                      tag={tag}
                      editing={editing === hero.id}
                      setEditing={setEditing}
                      updateEntity={updateEntity}
                      removeEntity={undefined}
                      addModifier={addModifier}
                    />
                  </div>
                </div>
              );
            })}
            {editing === hero.id && (
              <button
                onClick={() => {
                  const newTag = new (Tag as any)();
                  newTag.name = "New Relationship";
                  newTag.owner = hero.owner;
                  newTag.id = Math.random().toString();
                  const newRelationships = new Map(hero.relationships);
                  newRelationships.set("New Person", newTag);
                  updateEntity({ ...hero, relationships: newRelationships });
                }}
                style={{ padding: "4px", margin: "2px", cursor: "pointer" }}
              >
                + Add Relationship
              </button>
            )}
          </div>

          {/* Promise */}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
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
          <h3
            style={{
              margin: "1px",
              backgroundColor: "rgba(204, 165, 126, 0.43)",
              textAlign: "center",
            }}
          >
            Quintessences
          </h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[...(hero as any).quintessences || []].map((n) => {
              return editing === hero.id ? (
                <input
                  key={n}
                  type="text"
                  value={n || ""}
                  onChange={(e) => {
                    const newQuintessences = n;
                    newQuintessences[n] = e.target.value;
                    updateEntity({ ...hero, quintessences: newQuintessences });
                  }}
                  style={{ padding: "4px", margin: "2px" }}
                  placeholder={`Quintessence ${n + 1}`}
                />
              ) : (
                <span
                  key={n}
                  style={{ padding: "4px" }}
                >{n || ""}</span>
              );
            })}
            {editing === hero.id && (
              <button
                onClick={() => {
                  const quintessences = (hero as any).quintessences || [];
                  updateEntity({ ...hero, quintessences: [...quintessences, ""] });
                }}
                style={{ padding: "4px", margin: "2px", cursor: "pointer" }}
              >
                + Add Quintessence
              </button>
            )}
          </div>
        </>
      )}
      {side == "back" && !isFlipping && (
        <>
          {/* Backpack */}
          <h3>Backpack</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {hero.backpack.map((tag) => {
              return (
                <Tag
                  key={tag.id}
                  tag={tag}
                  editing={editing === hero.id}
                  setEditing={setEditing}
                  updateEntity={updateEntity}
                  removeEntity={undefined}
                  addModifier={addModifier}
                />
              );
            })}
            {editing === hero.id && (
              <button
                onClick={() => {
                  const newTag = new (Tag as any)();
                  newTag.name = "New Item";
                  newTag.owner = hero.owner;
                  newTag.id = Math.random().toString();
                  updateEntity({ ...hero, backpack: [...hero.backpack, newTag] });
                }}
                style={{ padding: "4px", margin: "2px", cursor: "pointer" }}
              >
                + Add Item
              </button>
            )}
          </div>

          {/* Notes */}
          <h3>Notes</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[...(hero as any).notes || []].map((n) => {
              return editing === hero.id ? (
                <textarea
                  key={n}
                  value={n || ""}
                  onChange={(e) => {
                    const newNotes = n;
                    newNotes[n] = e.target.value;
                    updateEntity({ ...hero, notes: newNotes });
                  }}
                  style={{ padding: "4px", margin: "2px", resize: "vertical", minHeight: "40px" }}
                  placeholder={`Note ${n + 1}`}
                />
              ) : (
                <span
                  key={n}
                  style={{ padding: "4px" }}
                >{n || ""}</span>
              );
            })}
            {editing === hero.id && (
              <button
                onClick={() => {
                  const notes = (hero as any).notes || [];
                  updateEntity({ ...hero, notes: [...notes, ""] });
                }}
                style={{ padding: "4px", margin: "2px", cursor: "pointer" }}
              >
                + Add Note
              </button>
            )}
          </div>
        </>
      )}

    </div>
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
