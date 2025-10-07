import constants, { CARD_STYLE } from "@/constants";
import { HeroTheme as LitmTheme } from "../../litm/theme";
import React, { useState } from "react";
import Tag from "../Tag";
import type { Entity } from "@/litm/entity";
import { Tag as LitmTag } from "../../litm/tag";

export default function HeroThemeCard({
  theme,
  editing,
  setEditing,
  updateEntity,
  removeEntity,
  addModifier,
}: HeroThemeCardProps) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setSide(side === "front" ? "back" : "front");
      setTimeout(() => setIsFlipping(false), 50);
    }, 50);
  };

  const mightColor = constants.MIGHT_COLORS[theme.might];

  const themeAsTag = LitmTag.deserialize(theme);

  return (
    <div style={{
      ...CARD_STYLE,
      margin: "4px",
      transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
      transition: 'transform 0.1s linear'
    }}>
      {/* Might and theme type */}
      <div
        style={{
          display: "flex",
          height: "40px",
          background: mightColor,
          color: "white",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 8px",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>{theme.type!.toUpperCase()}</span>
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
            onClick={() => setEditing(editing === theme.id ? undefined : theme.id)}
            style={{
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            {editing === theme.id ? "Done" : "Edit"}
          </button>
        </div>
      </div>
      {side == "front" && !isFlipping && (
        <>
          {/* Power Tags (first being larger)*/}
          <Tag
            tag={themeAsTag}
            editing={editing === theme.id}
            setEditing={setEditing}
            updateEntity={updateEntity}
            isTheme={true}
            removeEntity={undefined}
            addModifier={addModifier}
          />
          {theme.otherTags.map((tag) => {
            return (
              <Tag
                key={tag.id}
                tag={tag}
                editing={editing === theme.id}
                setEditing={setEditing}
                updateEntity={updateEntity}
                removeEntity={undefined}
                addModifier={addModifier}
              />
            );
          })}
          {editing === theme.id && (
            <button
              onClick={() => {
                const newTag = new (LitmTag as any)();
                newTag.name = "New Tag";
                newTag.owner = theme.owner;
                newTag.id = Math.random().toString();
                updateEntity({ ...theme, otherTags: [...theme.otherTags, newTag] });
              }}
              style={{ padding: "4px", margin: "2px", cursor: "pointer" }}
            >
              + Add Tag
            </button>
          )}
          {/* Weakness tags */}
          {theme.weaknessTags.map((tag) => {
            return (
              <Tag
                key={tag.id}
                tag={tag}
                editing={editing === theme.id}
                setEditing={setEditing}
                updateEntity={updateEntity}
                isWeakness={true}
                removeEntity={undefined}
                addModifier={addModifier}
              />
            );
          })}
          {editing === theme.id && (
            <button
              onClick={() => {
                const newTag = new (LitmTag as any)();
                newTag.name = "New Weakness";
                newTag.owner = theme.owner;
                newTag.id = Math.random().toString();
                updateEntity({ ...theme, weaknessTags: [...theme.weaknessTags, newTag] });
              }}
              style={{ padding: "4px", margin: "2px", cursor: "pointer" }}
            >
              + Add Weakness
            </button>
          )}
          {/* Quest */}
          {editing === theme.id ? (
            <textarea
              value={theme.quest}
              onChange={(e) => updateEntity({ ...theme, quest: e.target.value })}
              style={{ padding: "4px", margin: "4px", resize: "vertical", minHeight: "60px" }}
            />
          ) : (
            <div>{theme.quest}</div>
          )}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {/* Abandon, improve, milestone */}
            {["abandon", "improve", "milestone"].map((stat) => {
              return (
                <div
                  key={stat}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center`",
                  }}
                >
                  <span>{stat.toUpperCase()}</span>
                  <div>
                    {[...Array(theme.maxAdvancement).keys()].map((n) => {
                      return (
                        <input
                          key={n}
                          type="checkbox"
                          disabled={editing !== theme.id}
                          onChange={() => {
                            if (editing === theme.id) {
                              const newValue = n < (theme as any)[stat] ? n : n + 1;
                              updateEntity({ ...theme, [stat]: newValue });
                            }
                          }}
                          checked={n < (theme as any)[stat]}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {side == "back" && !isFlipping && (
        <>
          <h3
            style={{
              margin: "1px",
              backgroundColor: "rgba(204, 165, 126, 0.43)",
              textAlign: "center",
            }}
          >
            Special Improvements
          </h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {theme.specialImprovements.map((imp, n) => {
              return editing === theme.id ? (
                <input
                  key={n}
                  type="text"
                  value={imp}
                  onChange={(e) => {
                    const newImprovements = [...theme.specialImprovements];
                    newImprovements[n] = e.target.value;
                    updateEntity({ ...theme, specialImprovements: newImprovements });
                  }}
                  style={{ padding: "4px", margin: "2px" }}
                />
              ) : (
                <span
                  key={n}
                  style={{ padding: "4px" }}
                >{imp}</span>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}

interface HeroThemeCardProps {
  theme: LitmTheme;
  editing: string | undefined;
  setEditing: any;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
}
