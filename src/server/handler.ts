import type { ServerWebSocket } from "bun";
import { handleUpdateGameTableEntityPosition } from "./handlers/updateGameTableEntityPosition";
import { handleCreateNewGameTableEntity } from "./handlers/createNewGameTableEntity";
import { handleRollRequest } from "./handlers/rollRequest";
import { handleUpdateGameTableEntityDetails } from "./handlers/updateGameTableEntityDetails";
import type LitmDatabase from "./database";

export function handleMessage(
  ws: ServerWebSocket<{ authToken: string }>,
  message: string | Buffer<ArrayBufferLike>,
  db: LitmDatabase,
  server: Bun.Server
) {
  const parsedMessage = JSON.parse(message.toString());
  switch (parsedMessage.type) {
    case "updateGameTableEntityPosition": { handleUpdateGameTableEntityPosition(parsedMessage, db, server); break; }
    case "updateGameTableEntityDetails":  { handleUpdateGameTableEntityDetails(parsedMessage, db, server); break; }
    case "createNewGameTableEntity":      { handleCreateNewGameTableEntity(parsedMessage, db, server); break; }
    case "rollRequest":                   { handleRollRequest(parsedMessage, server); break; }
    default:
      {console.warn(`Unknown message type: ${parsedMessage.type}`);}
  }
}