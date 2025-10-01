import { deserializeRawEntity } from "@/litm/helpers";
import type { UpdateClientGameTableEntityDetails } from "@/messaging/message";
import type { EntityPositionData, StateSetter } from "@/types";

export function handleUpdateClientGameTableEntityDetails(
  message: UpdateClientGameTableEntityDetails,
  setGameTableEntities: StateSetter<EntityPositionData[]>,
) {
  const entity = deserializeRawEntity(message.entity);
  setGameTableEntities((prev) => {
    const old = prev.find((e) => e.entity.id == entity.id);
    if (!old)
      throw Error(
        "We are trying to update entity data the client doesnt have!",
      );
    return [
      ...prev.filter((e) => e.entity.id != entity.id),
      { ...old, entity: entity },
    ];
  });
}
