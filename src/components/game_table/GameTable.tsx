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
        // set the position locally
        setEntityPositions((prev) =>
            prev.map((entity_data) =>
                entity_data.entity.id === active.id
                    ? {
                        ...entity_data,
                        position: {
                            x: Math.min(Math.max(entity_data.position.x + (delta.x / transformContext.transformState.scale), 0), 2000 - 200),
                            y: Math.min(Math.max(entity_data.position.y + (delta.y / transformContext.transformState.scale), 0), 1200 - 40),
                        },
                    }
                    : entity_data
            )
        );
        // update the server position
        const movedEntity = entityPositions.find((entity_data) => entity_data.entity.id === active.id);
        if (movedEntity) {
            sendEntityPosition(
                movedEntity.entity.id,
                Math.min(Math.max(movedEntity.position.x + (delta.x / transformContext.transformState.scale), 0), 2000 - 200),
                Math.min(Math.max(movedEntity.position.y + (delta.y / transformContext.transformState.scale), 0), 1200 - 40)
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
                    <div 
                    id="game-board"
                    style={{
                        height: "1200px",
                        width: "2000px",
                        background: "conic-gradient(rgba(7, 75, 201, 0.14) 90deg,rgba(82, 96, 134, 0.33) 90deg 180deg,rgba(7, 75, 201, 0.14) 180deg 270deg,rgba(82, 96, 134, 0.33) 270deg)",
                        backgroundRepeat: "repeat",
                        backgroundSize: "60px 60px",
                        backgroundPosition: "top left",
                        // overflow: "hidden" 
                    }}
                    >
                        {entityPositions.map((entity_data) => (
                            <div
                                className="draggable-div"
                                key={entity_data.entity.id}
                                onMouseDown={() => setLastMovedEntityId(entity_data.entity.id)}
                                style={{position: "absolute"}}
                            >
                                <ContextMenuWrapper menu={getContextMenuForEntity(entity_data.entity)}>
                                    <DraggableEntity
                                        key={entity_data.entity.id}
                                        id={entity_data.entity.id}
                                        entity={entity_data.entity}
                                        x={entity_data.position.x}
                                        y={entity_data.position.y}
                                        height={lastMovedEntityId === entity_data.entity.id ? 10 : 2}
                                        bounds={{minX: 0, minY: 0, maxX: 2000, maxY: 1200}}
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

