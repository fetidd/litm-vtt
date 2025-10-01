import {
  UpdateClientGameTableEntityDetails,
  type UpdateGameTableEntityDetails,
} from "@/messaging/message";
import type LitmDatabase from "../database";
import { deserializeRawEntity } from "@/litm/helpers";
import type { EntityPositionData } from "@/types";

export function handleUpdateGameTableEntityDetails(
  { entity }: UpdateGameTableEntityDetails,
  db: LitmDatabase,
  server: Bun.Server,
) {
  const deserialized = deserializeRawEntity(entity);
  db.updateEntity(deserialized);
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
