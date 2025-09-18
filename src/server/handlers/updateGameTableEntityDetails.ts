import { UpdateClientGameTableEntityDetails, type UpdateGameTableEntityDetails } from "@/messaging/message";
import type LitmDatabase from "../database";
import { deserializeRawEntity } from "@/litm/helpers";

export function handleUpdateGameTableEntityDetails(
    { entity }: UpdateGameTableEntityDetails,
    db: LitmDatabase,
    server: Bun.Server
) {
    const deserialized = deserializeRawEntity(entity);
    const data = db.updateEntity(deserialized);
    server.publish("game-table", JSON.stringify(new UpdateClientGameTableEntityDetails(entity)));
}
