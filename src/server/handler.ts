import { ServerWebSocket } from "bun";
import { ClientMessage } from "../messaging/message";

function handleMessage(
  ws: ServerWebSocket<{ authToken: string }>,
  message: string | Buffer<ArrayBufferLike>,
  entities: Map<string, { entity: any, position: { x: number, y: number } }>,
  server: Bun.Server
) {
  // console.debug(`Received ${message}`);
  const parsedMessage: ClientMessage = JSON.parse(message.toString());

  switch (parsedMessage.type) {
    case "updateGameTableEntityPosition":
      // Handle the updateGameTableEntityPosition message
      const { id, x, y } = parsedMessage as any;
      const entityData = entities.get(id);
      if (entityData) {
        entityData.position.x = x;
        entityData.position.y = y;
      }
      // console.debug(`Updated entity ${id} position to (${x}, ${y})`);
      server.publish("game-table", JSON.stringify(parsedMessage));
      break;
    default:
      console.warn(`Unknown message type: ${parsedMessage.type}`);
  }
}

export { handleMessage };