import type { ServerWebSocket } from "bun";
import type LitmDatabase from "../database";
import type { EntityPositionData } from "@/types";
import type { Hero } from "@/litm/hero";
import type { Challenge } from "@/litm/challenge";
import { WebSocketServer } from "@/websocket/WebSocketManager";

export function handleNewWebSocketConnection(
  ws: ServerWebSocket<{ authToken: string }>,
  db: LitmDatabase,
) {
  console.debug(`WebSocket connection opened: ${ws.remoteAddress}`);
  ["game-table", "rolls", "drawer"].forEach((x) => ws.subscribe(x));
  
  const wsServer = new WebSocketServer();
  const entitiesToSync: EntityPositionData[] = db.getAllEntitiesWithPositions();
  wsServer.gameTableEntitySync(ws, entitiesToSync);

  const drawerEntities: (Hero | Challenge)[] = db.getAllDrawerEntities();
  wsServer.drawerEntitySync(ws, drawerEntities);
}
