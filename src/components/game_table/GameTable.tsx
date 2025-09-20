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
import { CreateNewGameTableEntity, DeleteGameTableEntity, UpdateGameTableEntityDetails, UpdateGameTableEntityPosition } from "../../messaging/message";
import { TransformComponent, useTransformContext } from "react-zoom-pan-pinch";
import constant from "../../constants";
import GameTableContextMenu from "../context_menu/GameTableContextMenu";
import { Tag as LitmTag } from "../../litm/tag";
import { Status as LitmStatus } from "../../litm/status";
import type { EntityPositionData, StateSetter } from "@/types";
import BasicContextMenu from "../context_menu/BasicContextMenu";

type GameTableProps = {
    websocket: WebSocket | null,
    gameTableEntities: EntityPositionData[],
    setGameTableEntities: StateSetter<EntityPositionData[]>,
    addModifier: (entity: ModifierEntity, polarity: 'add' | 'subtract', isBurned: boolean) => void;
};

export function GameTable({
    websocket,
    gameTableEntities,
    setGameTableEntities,
    addModifier,
}: GameTableProps) {
    const [lastMovedEntityId, setLastMovedEntityId] = useState<string | null>(null);
    const transformContext = useTransformContext();
    const [tableSize, setTableSize] = useState({ width: constant.GAME_TABLE_WIDTH, height: constant.GAME_TABLE_HEIGHT })
    const [editing, setEditing] = useState<string | undefined>(undefined)

    // WEBSOCKET MESSAGING
    function sendEntityPosition(id: string, x: number, y: number) {
        const message = new UpdateGameTableEntityPosition(id, x, y);
        websocket!.send(JSON.stringify(message));
    }

    function createNewGameTableEntity(entity: Entity, x: number, y: number) {
        const message = new CreateNewGameTableEntity(entity.serialize(), x, y);
        websocket!.send(JSON.stringify(message));
    }

    function calculateNewXPosition(entityData: EntityPositionData, delta: number, height: number) {
        return Math.min(Math.max(entityData.position.x + (delta / transformContext.transformState.scale), 0), height - (entityData.entity.name.length * constant.TAG_CHAR_WIDTH_MULTIPLIER))
    }

    function calculateNewYPosition(entityData: EntityPositionData, delta: number, width: number) {
        return Math.min(Math.max(entityData.position.y + (delta / transformContext.transformState.scale), 0), width - constant.TAG_HEIGHT);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, delta } = event;
        // set the position locally
        setGameTableEntities((prev) =>
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
        const movedEntity = gameTableEntities.find((entityData) => entityData.entity.id === active.id);
        if (movedEntity) {
            sendEntityPosition(
                movedEntity.entity.id,
                calculateNewXPosition(movedEntity, delta.x, tableSize.width),
                calculateNewYPosition(movedEntity, delta.y, tableSize.height)
            );
        }
    }

    function updateEntity(id: string, updater: (ent: Entity) => Entity) {
        const entityToUpdate = gameTableEntities.find(e => e.entity.id == id);
        if (entityToUpdate) {
            const updated = updater(entityToUpdate.entity);
            if (websocket == undefined || websocket == null) throw Error("Editing without an open websocket!");
            if (updated.name.length > 0) {
                setGameTableEntities(prev => {
                    return [...prev.filter(e => e.entity.id != id), { ...entityToUpdate, entity: updated }]
                })
                websocket.send(JSON.stringify(new UpdateGameTableEntityDetails(updated.serialize())))
            } else {
                removeEntityFromGameBoard(updated)
            }
        } else throw Error("How can we have edited an entity that doesnt exist?!");
    }

    function removeEntityFromGameBoard(entity: Entity) {
        setGameTableEntities(prev => [...prev.filter(e => e.entity.id != entity.id)]);
        if (websocket == undefined || websocket == null) throw Error("Editing without an open websocket!"); // TODO can this be a function that makes this check then returns the ws?
        websocket.send(JSON.stringify(new DeleteGameTableEntity(entity.id, entity.entityType)));
    }

    function getContextMenuForEntity(entity: Entity) {
        if (entity.canModify) {
            return <ModifierContextMenu
                entity={entity as ModifierEntity}
                addModifier={addModifier}
                removeEntity={removeEntityFromGameBoard}
                setEditing={setEditing}
                updateEntity={updateEntity}
            />;
        }
        return <BasicContextMenu
            entity={entity as Entity}
            removeEntity={removeEntityFromGameBoard}
        />;
    }

    const createNewGameBoardTag = (e: React.MouseEvent) => {
        const where = { x: e.clientX, y: e.clientY };
        // TODO open a modal to enter tag details, or extend the context menu with an input?
        const tag = new LitmTag("");
        setEditing(tag.id)
        setGameTableEntities(prev => [...prev, { entity: tag, position: where }])
        createNewGameTableEntity(tag, where.x, where.y)
    }

    const createNewGameBoardStatus = (e: React.MouseEvent, tier: number = 1) => {
        const where = { x: e.clientX, y: e.clientY };
        // open a modal to enter status details, or extend the context menu with an input?
        const status = new LitmStatus("", tier);
        setEditing(status.id)
        setGameTableEntities(prev => [...prev, { entity: status, position: where }])
        createNewGameTableEntity(status, where.x, where.y)
    }

    // DND SETUP
    const { setNodeRef } = useDroppable({
        id: "game-table",
    });
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
                    width: "80vw",
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
                        currentlyEditing={editing != undefined && editing.length > 0}
                        stopEditing={() => setEditing(undefined)}
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
                        {gameTableEntities.map((entityData) => (
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
            </DndContext >
    );
}

