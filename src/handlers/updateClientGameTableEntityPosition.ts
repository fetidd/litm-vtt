import type { UpdateGameTableEntityPosition } from "@/messaging/message";
import type { EntityPositionData, StateSetter } from "@/types";

export function handleUpdateClientGameTableEntityPosition({ id, x, y }: UpdateGameTableEntityPosition, setGameTableEntities: StateSetter<EntityPositionData[]>) {
    setGameTableEntities(prev => prev.map(e => e.entity.id === id ? { ...e, position: { x, y } } : e));
}