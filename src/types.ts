import type { Entity } from "./litm/entity";

export type EntityPositionData = { entity: Entity, position: { x: number, y: number } };

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>