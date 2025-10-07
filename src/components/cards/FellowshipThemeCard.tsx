import constants, { CARD_STYLE } from "@/constants";
import { Fellowship as LitmFellowship } from "../../litm/fellowship";
import { useState } from "react";
import { Tag as LitmTag } from "../../litm/tag";
import Tag from "../Tag";

export default function FellowshipThemeCard({
  theme,
  editing,
  setEditing,
  updateEntity,
  removeEntity,
  addModifier,
}: FellowshipThemeCardProps) {
  const [side, setSide] = useState<"front" | "back">("front");

  const themeAsTag = LitmTag.deserialize(theme);

  return (
    <div style={CARD_STYLE}>
      <div
        style={{
          display: "flex",
          height: "40px",
          background: "rgba(97, 61, 46, 1)",
          color: "white",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>FELLOWSHIP</span>
      </div>
      {side == "front" && (
        <>
          {/* Power Tags (first being larger)*/}
                    <Tag
                      tag={themeAsTag}
                      editing={false}
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
                          editing={false}
                          setEditing={setEditing}
                          updateEntity={updateEntity}
                          removeEntity={undefined}
                          addModifier={addModifier}
                        />
                      );
                    })}
                    {/* Weakness tags */}
                    {theme.weaknessTags.map((tag) => {
                      return (
                        <Tag
                          key={tag.id}
                          tag={tag}
                          editing={false}
                          setEditing={setEditing}
                          updateEntity={updateEntity}
                          isWeakness={true}
                          removeEntity={undefined}
                          addModifier={addModifier}
                        />
                      );
                    })}
                    {/* Quest */}
                    <div>{theme.quest}</div>
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
                                    onChange={() => {}}
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
      {side == "back" && (
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
              return (
                <span
                  key={n}
                  style={{ padding: "4px" }}
                >{imp}</span>
              );
            })}
          </div>
        </>
      )}
      <span onClick={() => setSide(side == "front" ? "back" : "front")}>
        flip
      </span>
    </div>
  );
}

interface FellowshipThemeCardProps {
  theme: LitmFellowship;
  editing: string | undefined;
  setEditing: any;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
}
