import React, { useState } from "react";
import {
    DndContext,
    useDroppable,
    DragEndEvent,
    useSensor,
    PointerSensor,
} from "@dnd-kit/core";
import { DraggableEntity } from "./DraggableEntity";
import Entity from "../../litm/entity";

type DraggableEntityData = {
    entity: Entity
    position: { x: number; y: number };
};

type GameTableProps = {
    entities: DraggableEntityData[];
    sendEntityPosition: (id: string, x: number, y: number) => void;
    toggleSelectedEntity: (entity: Entity) => void;
};

export function GameTable({ entities, sendEntityPosition, toggleSelectedEntity }: GameTableProps) {
    // console.debug("Rendering GameTable component with entities:", entities);

    const [entityPositions, setEntityPositions] = useState<DraggableEntityData[]>(entities);
    const [lastMovedEntityId, setLastMovedEntityId] = useState<string | null>(null);

    // console.debug("Entity positions state:", entityPositions);

    React.useEffect(() => {
        setEntityPositions(entities);
    }, [entities]);

    const { setNodeRef } = useDroppable({
        id: "game-table",
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        setEntityPositions((prev) =>
            prev.map((entity_data) =>
                entity_data.entity.id === active.id
                    ? {
                        ...entity_data,
                        position: {
                            x: entity_data.position.x + delta.x,
                            y: entity_data.position.y + delta.y,
                        },
                    }
                    : entity_data
            )
        );
        const movedEntity = entityPositions.find((entity_data) => entity_data.entity.id === active.id);
        if (movedEntity) {
            sendEntityPosition(
                movedEntity.entity.id,
                movedEntity.position.x + delta.x,
                movedEntity.position.y + delta.y
            );
        }
    };

    const handleClick = (entity: Entity) => {
        setLastMovedEntityId(entity.id);
        toggleSelectedEntity(entity);
    }

    const mouseSensor = useSensor(PointerSensor, { // allows buttons to work on draggables
        activationConstraint: {
            distance: 5
        }
    });

    return (
        <DndContext onDragEnd={handleDragEnd} sensors={[mouseSensor]}>
            <div
                ref={setNodeRef}
                style={{
                    position: "relative",
                    width: "80%",
                    height: "1000px",
                    border: "2px solid #68ff03ff",
                    overflow: "hidden",
                    margin: "20px",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                }}
            >
                {entityPositions.map((entity_data) => (
                    <DraggableEntity
                        key={entity_data.entity.id}
                        id={entity_data.entity.id}
                        entity={entity_data.entity}
                        x={entity_data.position.x}
                        y={entity_data.position.y}
                        height={lastMovedEntityId === entity_data.entity.id ? 10 : 2}
                        handleClick={handleClick}
                    />
                ))}
            </div>
        </DndContext>
    );
}