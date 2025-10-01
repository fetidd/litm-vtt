import { RollRequest, RollResponse } from "@/messaging/message";
import { generateId } from "@/utils";

export function handleRollRequest(
  { message }: RollRequest,
  server: Bun.Server,
) {
  const response = new RollResponse(generateId(), message);
  server.publish("rolls", JSON.stringify(response));
}
