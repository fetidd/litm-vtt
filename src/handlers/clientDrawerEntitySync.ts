import type { StateSetter } from "../types";
import { deserializeRawEntity } from "@/litm/helpers";
import type { Entity } from "@/litm/entity";

export function handleClientDrawerEntitySync(
  { entities }: { entities: Entity[] },
  setDrawerEntities: StateSetter<Entity[]>,
) {
  const des = entities.map((entity) => deserializeRawEntity(entity));
  setDrawerEntities(() => des);
}
