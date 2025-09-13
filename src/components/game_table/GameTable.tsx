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
import { TransformComponent, useTransformContext } from "react-zoom-pan-pinch";
import { GAME_TABLE_HEIGHT, GAME_TABLE_SELECTED_ENTITY_ZINDEX, GAME_TABLE_WIDTH, GAME_TABLE_ZINDEX, TAG_CHAR_WIDTH_MULTIPLIER, TAG_HEIGHT } from "../../constants";

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
    const [entityPositions, setEntityPositions] = useState<DraggableEntityData[]>(entities);
    const [lastMovedEntityId, setLastMovedEntityId] = useState<string | null>(null);
    const transformContext = useTransformContext();
    const [tableSize, setTableSize] = useState({ width: GAME_TABLE_WIDTH, height: GAME_TABLE_HEIGHT })

    React.useEffect(() => {
        setEntityPositions(entities);
    }, [entities]);


    const sendEntityPosition = (id: string, x: number, y: number) => {
        const message = new UpdateGameTableEntityPosition(id, x, y);
        websocket!.send(JSON.stringify(message));
    }

    const { setNodeRef } = useDroppable({
        id: "game-table",
    });

    const calculateNewXPosition = (entityData: DraggableEntityData, delta: number, height: number) => {
        return Math.min(Math.max(entityData.position.x + (delta / transformContext.transformState.scale), 0), height - (entityData.entity.name.length * TAG_CHAR_WIDTH_MULTIPLIER))
    };
    const calculateNewYPosition = (entityData: DraggableEntityData, delta: number, width: number) => {
        return Math.min(Math.max(entityData.position.y + (delta / transformContext.transformState.scale), 0), width - TAG_HEIGHT)
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        // set the position locally
        setEntityPositions((prev) =>
            prev.map((entityData) =>
                entityData.entity.id === active.id
                    ? {
                        ...entityData,
                        position: {
                            x: calculateNewXPosition(entityData, delta.x, tableSize.width),
                            y: calculateNewYPosition(entityData, delta.y, tableSize.height),
                        },
                    }
                    : entityData
            )
        );
        // update the server position
        const movedEntity = entityPositions.find((entityData) => entityData.entity.id === active.id);
        if (movedEntity) {
            sendEntityPosition(
                movedEntity.entity.id,
                calculateNewXPosition(movedEntity, delta.x, tableSize.width),
                calculateNewYPosition(movedEntity, delta.y, tableSize.height)
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
                    wrapperStyle={{ height: "100%", width: "100%" }}
                // contentStyle={{ border: "2px solid #ffffffff", padding: "5px" }}
                >
                    <div
                        id="game-board"
                        style={{
                            height: `${tableSize.height}px`,
                            width: `${tableSize.width}px`,
                            background: "conic-gradient(rgba(7, 75, 201, 0.14) 90deg,rgba(82, 96, 134, 0.33) 90deg 180deg,rgba(7, 75, 201, 0.14) 180deg 270deg,rgba(82, 96, 134, 0.33) 270deg)",
                            backgroundRepeat: "repeat",
                            backgroundSize: "60px 60px",
                            backgroundPosition: "top left",
                            // overflow: "hidden" 
                        }}
                    >
                        {entityPositions.map((entityData) => (
                            <div
                                className="draggable-div"
                                key={entityData.entity.id}
                                onMouseDown={() => setLastMovedEntityId(entityData.entity.id)}
                                style={{ position: "absolute" }}
                            >
                                <ContextMenuWrapper menu={getContextMenuForEntity(entityData.entity)}>
                                    <DraggableEntity
                                        key={entityData.entity.id}
                                        id={entityData.entity.id}
                                        entity={entityData.entity}
                                        x={entityData.position.x}
                                        y={entityData.position.y}
                                        zIndex={lastMovedEntityId === entityData.entity.id ? GAME_TABLE_SELECTED_ENTITY_ZINDEX : GAME_TABLE_ZINDEX}
                                        bounds={{ minX: 0, minY: 0, maxX: tableSize.width, maxY: tableSize.height }}
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

