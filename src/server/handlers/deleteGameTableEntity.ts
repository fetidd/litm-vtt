import type LitmDatabase from "../database";
import type { EntityPositionData } from "@/types";
import type { DeleteGameTableEntity } from "@/messaging/message";

export function handleDeleteGameTableEntity(
  { id, entityType }: DeleteGameTableEntity,
  db: LitmDatabase,
  server: Bun.Server,
) {
  db.deleteEntity(id, entityType);
  const entitiesToSync: EntityPositionData[] = db.getAllEntitiesWithPositions();
  const syncMessage = {
    // TODO refactor out to DRY
    type: "gameTableEntitySync",
    entities: entitiesToSync.map((data) => {
      return { ...data, entity: data.entity.serialize() };
    }),
  };
  server.publish("game-table", JSON.stringify(syncMessage));
}
