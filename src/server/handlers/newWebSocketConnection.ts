import type { ServerWebSocket } from "bun";
import type LitmDatabase from "../database";
import type { EntityPositionData } from "@/types";
import type { Hero } from "@/litm/hero";
import type { Challenge } from "@/litm/challenge";

export function handleNewWebSocketConnection(
  ws: ServerWebSocket<{ authToken: string }>,
  db: LitmDatabase,
) {
  console.debug(`WebSocket connection opened: ${ws.remoteAddress}`);
  ["game-table", "rolls", "drawer"].forEach((x) => ws.subscribe(x));
  const entitiesToSync: EntityPositionData[] = db.getAllEntitiesWithPositions();
  const syncMessage = {
    // TODO refactor out to DRY
    type: "gameTableEntitySync",
    entities: entitiesToSync.map((data) => {
      return { ...data, entity: data.entity.serialize() };
    }),
  };
  ws.send(JSON.stringify(syncMessage));

  const drawerEntities: (Hero | Challenge)[] = db.getAllDrawerEntities();
  const syncMessageDrawer = {
    // TODO refactor out to DRY
    type: "drawerEntitySync",
    entities: drawerEntities.map((entity) => entity.serialize()),
  };
  ws.send(JSON.stringify(syncMessageDrawer));
}
