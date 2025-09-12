import React, { useEffect, useState } from "react";
import {
    DndContext,
    useDroppable,
    useSensor,
    PointerSensor,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { DraggableEntity } from "./DraggableEntity";
import { Entity, ModifierEntity } from "../../litm/entity";
import { ContextMenuWrapper } from "../context_menu/ContextMenuWrapper";
import ModifierContextMenu from "../context_menu/ModifierContextMenu";
import { UpdateGameTableEntityPosition } from "../../messaging/message";
import { TransformWrapper, TransformComponent, useTransformContext } from "react-zoom-pan-pinch";

type DraggableEntityData = {
    entity: Entity
    position: { x: number; y: number };
};

type GameTableProps = {
    websocket: WebSocket | null,
    entities: DraggableEntityData[];
    addModifier: (entity: ModifierEntity, polarity: 'add' | 'subtract', isBurned: boolean) => void;
    removeEntity: (entity: Entity) => void;
};

export function GameTable({
    entities,
    addModifier,
    removeEntity,
    websocket
}: GameTableProps) {
    // console.debug("Rendering GameTable component with entities:", entities);

    const [entityPositions, setEntityPositions] = useState<DraggableEntityData[]>(entities);
    const [lastMovedEntityId, setLastMovedEntityId] = useState<string | null>(null);
    const transformContext = useTransformContext();

    // console.debug("Entity positions state:", entityPositions);

    React.useEffect(() => {
        setEntityPositions(entities);
    }, [entities]);


    const sendEntityPosition = (id: string, x: number, y: number) => {
        const message = new UpdateGameTableEntityPosition(id, x, y);
        // console.debug("Sending message:", message);
        websocket!.send(JSON.stringify(message));
    }

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
                            x: entity_data.position.x + (delta.x / transformContext.transformState.scale),
                            y: entity_data.position.y + (delta.y / transformContext.transformState.scale),
                        },
                    }
                    : entity_data
            )
        );
        const movedEntity = entityPositions.find((entity_data) => entity_data.entity.id === active.id);
        if (movedEntity) {
            sendEntityPosition(
                movedEntity.entity.id,
                movedEntity.position.x + (delta.x / transformContext.transformState.scale),
                movedEntity.position.y + (delta.y / transformContext.transformState.scale)
            );
        }
    };

    const mouseSensor = useSensor(PointerSensor, { // allows buttons to work on draggables
        activationConstraint: {
            distance: 5
        }
    });

    const getContextMenuForEntity = (entity: Entity) => {
        if (entity.canModify) {
            return <ModifierContextMenu
                entity={entity as ModifierEntity}
                addModifier={addModifier}
                removeEntity={removeEntity}
            />;
        }
        return null;
    };

    return (

        <DndContext onDragEnd={handleDragEnd} sensors={[mouseSensor]}>
            <div
                ref={setNodeRef}
                style={{
                    position: "relative",
                    width: "90vw",
                    height: "98vh",
                    border: "2px solid #68ff03ff",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    background: "rgba(37, 41, 58, 1)",
                    overflow: "hidden"
                }}
            >
                <TransformComponent
                    wrapperStyle={{height: "100%", width: "100%" }}
                    // contentStyle={{ border: "2px solid #ffffffff", padding: "5px" }}
                >
                    <div style={{
                        height: "3000px",
                        width: "3000px",
                        background: "conic-gradient(#dc57af 90deg,#a80f75 90deg 180deg,#dc57af 180deg 270deg,#a80f75 270deg)",
                        backgroundRepeat: "repeat",
                        backgroundSize: "60px 60px",
                        backgroundPosition: "top left",
                        overflow: "hidden" 
                    }}
                    >
                        {entityPositions.map((entity_data) => (
                            <div
                                key={entity_data.entity.id}
                                onMouseDown={() => setLastMovedEntityId(entity_data.entity.id)}
                            >
                                <ContextMenuWrapper menu={getContextMenuForEntity(entity_data.entity)}>
                                    <DraggableEntity
                                        key={entity_data.entity.id}
                                        id={entity_data.entity.id}
                                        entity={entity_data.entity}
                                        x={entity_data.position.x}
                                        y={entity_data.position.y}
                                        height={lastMovedEntityId === entity_data.entity.id ? 10 : 2}
                                    />
                                </ContextMenuWrapper>
                            </div>
                        ))}
                    </div>
                </TransformComponent>
            </div>
        </DndContext>
    );
}

