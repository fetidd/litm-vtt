import type { ServerWebSocket } from 'bun';
import type LitmDatabase from '../database';


export function handleNewWebSocketConnection(
    ws: ServerWebSocket<{ authToken: string }>,
    db: LitmDatabase
) {
    console.debug(`WebSocket connection opened: ${ws.remoteAddress}`);
    ["game-table", "rolls"].forEach(x => ws.subscribe(x));
    const syncMessage = {
        type: 'gameTableEntitySync',
        entities: [{ entity: { serialize: () => 123 }, position: { x: 10, y: 10 } }].map(data => { return { ...data, entity: data.entity.serialize() } })
    };
    ws.send(JSON.stringify(syncMessage));
}