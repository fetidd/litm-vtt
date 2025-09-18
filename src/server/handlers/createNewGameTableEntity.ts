import type { CreateNewGameTableEntity } from "@/messaging/message";
import type LitmDatabase from "../database";
import type { EntityPositionData } from "@/types";
import { deserializeRawEntity } from "@/litm/helpers";

export function handleCreateNewGameTableEntity(
  { entity, x, y }: CreateNewGameTableEntity, 
  db: LitmDatabase, 
  server: Bun.Server
) {
  const deserialized = deserializeRawEntity(entity);
  console.log(deserialized)
  db.createNewEntity(deserialized);
  db.addEntityToGameBoard(deserialized, x, y);
  const entitiesToSync: EntityPositionData[] = db.getAllEntitiesWithPositions();
  const syncMessage = { // TODO refactor out to DRY
    type: 'gameTableEntitySync',
    entities: entitiesToSync.map(data => {return { ...data, entity: data.entity.serialize()}})
  };
  server.publish("game-table", JSON.stringify(syncMessage));
}