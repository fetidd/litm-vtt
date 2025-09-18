import { UpdateClientGameTableEntityDetails, type UpdateGameTableEntityDetails } from "@/messaging/message";
import { deserializeRawEntity } from "@/utils";
import type LitmDatabase from "../database";

export function handleUpdateGameTableEntityDetails(
    { entity }: UpdateGameTableEntityDetails,
    db: LitmDatabase,
    server: Bun.Server
) {
    const deserialized = deserializeRawEntity(entity);
    const data = entities.get(deserialized.id);
    if (data) {
        entities.set(deserialized.id, { ...data, entity: deserialized });
    }
    server.publish("game-table", JSON.stringify(new UpdateClientGameTableEntityDetails(entity.serialize())));
}
