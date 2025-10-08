import {
  UpdateClientGameTableEntityDetails,
  type UpdateGameTableEntityDetails,
} from "@/messaging/message";
import type LitmDatabase from "../database";
import { deserializeRawEntity } from "@/litm/helpers";
import type { EntityPositionData } from "@/types";
import { WebSocketServer } from "@/websocket/WebSocketManager";

export function handleUpdateGameTableEntityDetails(
  { entity }: UpdateGameTableEntityDetails,
  db: LitmDatabase,
  server: Bun.Server,
) {
  const deserialized = deserializeRawEntity(entity);
  db.updateEntity(deserialized);
  const wsServer = new WebSocketServer();
  const entitiesToSync: EntityPositionData[] = db.getAllEntitiesWithPositions();
  wsServer.gameTableEntitySync({ send: (msg: string) => server.publish("game-table", msg) }, entitiesToSync);
}
