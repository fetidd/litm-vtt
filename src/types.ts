import type { Entity } from "./litm/entity";

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
