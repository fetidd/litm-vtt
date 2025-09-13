import type { ServerWebSocket } from "bun";
import { ClientMessage, RollRequest, RollResponse, UpdateGameTableEntityPosition } from "../messaging/message";
import { generateId } from "../utils";

function handleMessage(
  ws: ServerWebSocket<{ authToken: string }>,
  message: string | Buffer<ArrayBufferLike>,
  entities: Map<string, { entity: any, position: { x: number, y: number } }>,
  server: Bun.Server
) {
  const parsedMessage: ClientMessage = JSON.parse(message.toString());
  switch (parsedMessage.type) {


    case "updateGameTableEntityPosition":
      // Handle the updateGameTableEntityPosition message
      const { id, x, y } = parsedMessage as UpdateGameTableEntityPosition;
      const entityData = entities.get(id);
      if (entityData) {
        entityData.position.x = x;
        entityData.position.y = y;
      }
      server.publish("game-table", JSON.stringify(parsedMessage));
      break;


    case "rollRequest":
      const { message } = parsedMessage as RollRequest;
      const response = new RollResponse(generateId(), message);
      server.publish("rolls", JSON.stringify(response))
      break;


    default:
      console.warn(`Unknown message type: ${parsedMessage.type}`);
  }
}

export { handleMessage };