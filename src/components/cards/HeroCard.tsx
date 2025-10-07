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

  return (
    <div style={CARD_STYLE}>
      <div
        style={{
          display: "flex",
          height: "40px",
          background: "rgba(122, 79, 61, 1)",
          color: "white",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>HERO</span>
      </div>
      {side == "front" && (
        <>
          {/* Hero name */}
          <div style={{ fontSize: "2rem", textAlign: "center" }}>
            {hero.name}
          </div>

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
          <div style={{ textAlign: "center" }}>{hero.owner}</div>

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
                    <span>{name}</span>
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
                      editing={false}
                      setEditing={setEditing}
                      updateEntity={updateEntity}
                      removeEntity={undefined}
                      addModifier={addModifier}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Promise */}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <h3>Promise</h3>
            {[...Array(hero.maxPromise).keys()].map((n) => {
              return (
                <input
                  key={n}
                  type="checkbox"
                  onChange={() => {}}
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
            {[...Array(4).keys()].map((n) => {
              return (
                <span
                  key={n}
                  style={{ padding: "4px" }}
                >{`Quintessence ${n}`}</span>
              );
            })}
          </div>
        </>
      )}
      {side == "back" && (
        <>
          {/* Backpack */}
          <h3>Backpack</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {hero.backpack.map((tag) => {
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
          </div>

          {/* Notes */}
          <h3>Notes</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[...Array(4).keys()].map((n) => {
              return <span>{`Note ${n}`}</span>;
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

interface HeroCardProps {
  hero: LitmHero;
  editing: string | undefined;
  setEditing: any;
  updateEntity: any;
  removeEntity: any;
  addModifier: any;
}
