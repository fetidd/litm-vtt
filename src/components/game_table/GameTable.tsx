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
import { CreateNewGameTableEntity, UpdateGameTableEntityPosition } from "../../messaging/message";
import { TransformComponent, useTransformContext } from "react-zoom-pan-pinch";
import constant from "../../constants";
import GameTableContextMenu from "../context_menu/GameTableContextMenu";
import { Tag as LitmTag } from "../../litm/tag";
import { Status as LitmStatus } from "../../litm/status";

type DraggableEntityData = {
    entity: Entity;
    position: { x: number; y: number };
};

type GameTableProps = {
    websocket: WebSocket | null,
    entities: DraggableEntityData[];
    addModifier: (entity: ModifierEntity, polarity: 'add' | 'subtract', isBurned: boolean) => void;
    removeEntity: (entity: Entity) => void;
    addEntity: (entity: Entity, position: {x: number, y: number}) => void;
    updateEntity: (id: string, updater: (ent: Entity) => Entity) => void;
};

export function GameTable({
    entities,
    addModifier,
    removeEntity,
    addEntity,
    updateEntity,
    websocket,
}: GameTableProps) {
    const [entityPositions, setEntityPositions] = useState<DraggableEntityData[]>(entities);
    const [lastMovedEntityId, setLastMovedEntityId] = useState<string | null>(null);
    const transformContext = useTransformContext();
    const [tableSize, setTableSize] = useState({ width: constant.GAME_TABLE_WIDTH, height: constant.GAME_TABLE_HEIGHT })
    const [editing, setEditing] = useState<string | undefined>(undefined)

    React.useEffect(() => {
        setEntityPositions(entities);
    }, [entities]);

    const sendEntityPosition = (id: string, x: number, y: number) => {
        const message = new UpdateGameTableEntityPosition(id, x, y);
        websocket!.send(JSON.stringify(message));
    }

    const createNewGameTableEntity = (entity: Entity, x: number, y: number) => {
        const message = new CreateNewGameTableEntity(entity.serialize(), x, y);
        websocket!.send(JSON.stringify(message));
    }

    const { setNodeRef } = useDroppable({
        id: "game-table",
    });

    const calculateNewXPosition = (entityData: DraggableEntityData, delta: number, height: number) => {
        return Math.min(Math.max(entityData.position.x + (delta / transformContext.transformState.scale), 0), height - (entityData.entity.name.length * constant.TAG_CHAR_WIDTH_MULTIPLIER))
    };
    const calculateNewYPosition = (entityData: DraggableEntityData, delta: number, width: number) => {
        return Math.min(Math.max(entityData.position.y + (delta / transformContext.transformState.scale), 0), width - constant.TAG_HEIGHT)
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

    const createNewGameBoardTag = (e: React.MouseEvent) => {
        const where = {x: e.clientX, y: e.clientY};
        // open a modal to enter tag details, or extend the context menu with an input?
        const tag = new LitmTag("TAG");
        setEditing(tag.id)
        addEntity(tag, where)
        createNewGameTableEntity(tag, where.x, where.y)
    }

    const createNewGameBoardStatus = (e: React.MouseEvent) => {
        const where = {x: e.clientX, y: e.clientY};
        // open a modal to enter status details, or extend the context menu with an input?
        const status = new LitmStatus("TAG");
        setEditing(status.id)
        addEntity(status, where)
        createNewGameTableEntity(status, where.x, where.y)
    }

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
                    <ContextMenuWrapper menu={<GameTableContextMenu 
                            createNewGameBoardTag={createNewGameBoardTag}
                            createNewGameBoardStatus={createNewGameBoardStatus}
                        />} >
                        <div
                            id="game-board"
                            onContextMenu={e => {
                                e.preventDefault();
                            }}
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
                                            zIndex={lastMovedEntityId === entityData.entity.id ? constant.GAME_TABLE_SELECTED_ENTITY_ZINDEX : constant.GAME_TABLE_ZINDEX}
                                            bounds={{ minX: 0, minY: 0, maxX: tableSize.width, maxY: tableSize.height }}
                                            editable={entityData.entity.id === editing}
                                            updateEntity={updateEntity}
                                            setEditingEntity={setEditing}
                                        />
                                    </ContextMenuWrapper>
                                </div>
                            ))}
                        </div>
                    </ContextMenuWrapper>
                </TransformComponent>
            </div>
        </DndContext>
    );
}

