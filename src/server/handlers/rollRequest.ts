import { RollRequest, RollResponse } from "@/messaging/message";
import { generateId } from "@/utils";
import { WebSocketServer } from "@/websocket/WebSocketManager";

export function handleRollRequest(
  { message }: RollRequest,
  server: Bun.Server,
) {
  const wsServer = new WebSocketServer();
  wsServer.rollResponse(server, generateId(), message);
}
