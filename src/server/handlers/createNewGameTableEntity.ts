import type { CreateNewGameTableEntity } from "@/messaging/message";
import { deserializeRawEntity } from "@/utils";
import type LitmDatabase from "../database";
import type { EntityPositionData } from "@/types";

export function handleCreateNewGameTableEntity(
  { entity, x, y }: CreateNewGameTableEntity, 
  db: LitmDatabase, 
  server: Bun.Server
) {
  const deserialized = deserializeRawEntity(entity);
  db.createNewEntity(deserialized);
  db.addEntityToGameBoard(deserialized, x, y);
  const entitiesToSync: EntityPositionData[] = db.getAllEntitiesWithPositions();
  const syncMessage = { // TODO refactor out to DRY
    type: 'gameTableEntitySync',
    entities: entitiesToSync
  };
  server.publish("game-table", JSON.stringify(syncMessage));
}