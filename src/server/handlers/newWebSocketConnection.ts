import type { ServerWebSocket } from 'bun';
import type LitmDatabase from '../database';
import type { EntityPositionData } from '@/types';


export function handleNewWebSocketConnection(
    ws: ServerWebSocket<{ authToken: string }>,
    db: LitmDatabase
) {
    console.debug(`WebSocket connection opened: ${ws.remoteAddress}`);
    ["game-table", "rolls"].forEach(x => ws.subscribe(x));
    const entitiesToSync: EntityPositionData[] = db.getAllEntitiesWithPositions();
    const syncMessage = { // TODO refactor out to DRY
        type: 'gameTableEntitySync',
        entities: entitiesToSync
    };
    ws.send(JSON.stringify(syncMessage));
}