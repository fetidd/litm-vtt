import { UpdateGameTableEntityPosition } from "@/messaging/message";
import { Database } from "bun:sqlite";
import type LitmDatabase from "../database";
import { WebSocketServer } from "@/websocket/WebSocketManager";

export function handleUpdateGameTableEntityPosition(
  { id, x, y }: UpdateGameTableEntityPosition,
  db: LitmDatabase,
  server: Bun.Server,
) {
  // Handle the updateGameTableEntityPosition message
  const entityData = db.updateEntityPosition(id, x, y);
  const wsServer = new WebSocketServer();
  wsServer.updateGameTableEntityPosition(server, id, x, y);
}
