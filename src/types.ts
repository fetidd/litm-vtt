import type { Entity, EntityType } from "./litm/entity";

export type EntityPositionData = {
  entity: Entity;
  position: { x: number; y: number };
};

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type RawHero = {
  id: string;
  name: string;
  promise: number;
  description: string;
  entityType: string;
  themes: object[];
  backpack: object[];
  fellowship?: object;
  relationships: object[];
  owner: string;
};

export type SearchParams = {
  entityId: string;
  entityType:
    | "main-tag"
    | "other-tag"
    | "weakness-tag"
    | "hero"
    | "quest"
    | "hero-name"
    | "milestone"
    | "abandon"
    | "improve"
    | "backpack-tag"
    | "relationship"
    | "promise"
    | "quintessence"
    | "note"
    | "special-improvement";
  themeId?: string;
  themeType?: "fellowship" | "hero" | "story" | undefined
  heroId?: string;
};
