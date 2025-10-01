import { UpdateGameTableEntityPosition } from "@/messaging/message";
import { Database } from "bun:sqlite";
import type LitmDatabase from "../database";

export function handleUpdateGameTableEntityPosition(
  { id, x, y }: UpdateGameTableEntityPosition,
  db: LitmDatabase,
  server: Bun.Server,
) {
  // Handle the updateGameTableEntityPosition message
  const entityData = db.updateEntityPosition(id, x, y);
  server.publish(
    "game-table",
    JSON.stringify(new UpdateGameTableEntityPosition(id, x, y)),
  );
}
