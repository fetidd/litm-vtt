import React, { useContext, useState } from "react";
import {
  DndContext,
  useDroppable,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { DraggableEntity } from "./DraggableEntity";
import { Entity, ModifierEntity } from "../../litm/entity";
import type { WebSocketManager } from "@/websocket/WebSocketManager";
import {
  TransformComponent,
  useTransformContext,
} from "react-zoom-pan-pinch";
import constant from "@/constants";
import { Tag as LitmTag } from "@/litm/tag";
import { Status as LitmStatus } from "@/litm/status";
import type { EntityPositionData, StateSetter } from "@/types";
import { Item, Submenu, ContextMenuWrapper, useContextMenu } from "@/components/ui/ContextMenu";
import { UserContext } from "@/App";

type GameTableProps = {
  websocket: WebSocketManager | null;
  gameTableEntities: EntityPositionData[];
  setGameTableEntities: StateSetter<EntityPositionData[]>;
  backgroundImage: string | null;
  addModifier: (
    entity: ModifierEntity,
    polarity: "add" | "subtract",
    isBurned: boolean,
  ) => void;
};

export function GameTable({
  websocket,
  gameTableEntities,
  setGameTableEntities,
  backgroundImage,
  addModifier,
}: GameTableProps) {
  const [lastMovedEntityId, setLastMovedEntityId] = useState<string | null>(
    null,
  );
  const [newEntityId, setNewEntityId] = useState<string | null>(null);
  const transformContext = useTransformContext();
  const [tableSize, setTableSize] = useState({
    width: constant.GAME_TABLE_WIDTH,
    height: constant.GAME_TABLE_HEIGHT,
  });
  const user = useContext(UserContext);

  // WEBSOCKET MESSAGING
  function sendEntityPosition(id: string, x: number, y: number) {
    websocket!.updateGameTableEntityPosition(id, x, y);
  }

  function createNewGameTableEntity(entity: Entity, x: number, y: number) {
    websocket!.createNewGameTableEntity(entity, x, y);
  }

  function calculateNewXPosition(
    entityData: EntityPositionData,
    delta: number,
    height: number,
  ) {
    return Math.min(
      Math.max(
        entityData.position.x + delta / transformContext.transformState.scale,
        0,
      ),
      height -
        entityData.entity.name.length * constant.TAG_CHAR_WIDTH_MULTIPLIER,
    );
  }

  function calculateNewYPosition(
    entityData: EntityPositionData,
    delta: number,
    width: number,
  ) {
    return Math.min(
      Math.max(
        entityData.position.y + delta / transformContext.transformState.scale,
        0,
      ),
      width - constant.TAG_HEIGHT,
    );
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
          : entityData,
      ),
    );
    // update the server position
    const movedEntity = gameTableEntities.find(
      (entityData) => entityData.entity.id === active.id,
    );
    if (movedEntity) {
      sendEntityPosition(
        movedEntity.entity.id,
        calculateNewXPosition(movedEntity, delta.x, tableSize.width),
        calculateNewYPosition(movedEntity, delta.y, tableSize.height),
      );
    }
  }

  function updateEntity(id: string, updater: (ent: Entity) => Entity) {
    const entityToUpdate = gameTableEntities.find((e) => e.entity.id == id);
    if (entityToUpdate) {
      const updated = updater(entityToUpdate.entity);
      if (websocket == undefined || websocket == null)
        throw Error("Editing without an open websocket!");
      if (updated.name.length > 0) {
        setGameTableEntities((prev) => {
          return [
            ...prev.filter((e) => e.entity.id != id),
            { ...entityToUpdate, entity: updated },
          ];
        });
        websocket.updateGameTableEntityDetails(updated);
      } else {
        removeEntityFromGameBoard(updated);
      }
    } else throw Error("How can we have edited an entity that doesnt exist?!");
  }

  function removeEntityFromGameBoard(entity: Entity) {
    setGameTableEntities((prev) => [
      ...prev.filter((e) => e.entity.id != entity.id),
    ]);
    if (websocket == undefined || websocket == null)
      throw Error("Editing without an open websocket!"); // TODO can this be a function that makes this check then returns the ws?
    websocket.deleteGameTableEntity(entity.id, entity.entityType);
  }

  const createNewGameBoardTag = (where: { x: number; y: number }) => {
    const tag = LitmTag.blank();
    tag.owner = user!.username;
    where.x -= transformContext.transformState.positionX;
    where.y -= transformContext.transformState.positionY;
    setGameTableEntities((prev) => [...prev, { entity: tag, position: where }]);
    createNewGameTableEntity(tag, where.x, where.y);
    setNewEntityId(tag.id);
  };

  const createNewGameBoardStatus = (
    where: { x: number; y: number },
    tier: number = 1,
  ) => {
    const status = LitmStatus.blank();
    status.owner = user!.username;
    status.addTier(tier);
    where.x -= transformContext.transformState.positionX;
    where.y -= transformContext.transformState.positionY;
    setGameTableEntities((prev) => [
      ...prev,
      { entity: status, position: where },
    ]);
    createNewGameTableEntity(status, where.x, where.y);
    setNewEntityId(status.id);
  };

  // DND SETUP
  const { setNodeRef } = useDroppable({
    id: "game-table",
  });
  const mouseSensor = useSensor(PointerSensor, {
    // allows buttons to work on draggables
    activationConstraint: {
      distance: 5,
    },
  });

  function handleNewTagClick(params?: { props?: any; triggerEvent?: MouseEvent }) {
    if (!params?.triggerEvent) return;
    createNewGameBoardTag({ x: params.triggerEvent.pageX, y: params.triggerEvent.pageY });
  }
  function handleNewStatusClick(params?: { props?: any; triggerEvent?: MouseEvent }, tier?: number) {
    if (!params?.triggerEvent || !tier) return;
    createNewGameBoardStatus(
      { x: params.triggerEvent.pageX, y: params.triggerEvent.pageY },
      tier,
    );
  }

  const gameTableMenu = (
    <>
      <Item onClick={handleNewTagClick}>
        New tag
      </Item>
      <Submenu label="New status">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Item
            key={n}
            onClick={(params) => handleNewStatusClick(params, n)}
          >{`Tier ${n}`}</Item>
        ))}
      </Submenu>
    </>
  );

  return (
    <>
      <DndContext onDragEnd={handleDragEnd} sensors={[mouseSensor]}>
        <ContextMenuWrapper menu={gameTableMenu}>
          <div
            ref={setNodeRef}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              border: "2px solid #68ff03ff",
              borderRadius: "4px",
              boxSizing: "border-box",
              background: "rgba(37, 41, 58, 1)",
              overflow: "hidden",
            }}
          >
          <TransformComponent wrapperStyle={{ height: "100%", width: "100%" }}>
            <div
              id="game-board"
              style={{
                height: `${tableSize.height}px`,
                width: `${tableSize.width}px`,
                background: backgroundImage 
                  ? `url(${backgroundImage})` 
                  : "conic-gradient(rgba(7, 75, 201, 0.14) 90deg,rgba(82, 96, 134, 0.33) 90deg 180deg,rgba(7, 75, 201, 0.14) 180deg 270deg,rgba(82, 96, 134, 0.33) 270deg)",
                backgroundRepeat: backgroundImage ? "no-repeat" : "repeat",
                backgroundSize: backgroundImage ? "cover" : "60px 60px",
                backgroundPosition: "top left",
              }}

            >
              {gameTableEntities.map((entityData) => (
                <div
                  className="draggable-div"
                  key={entityData.entity.id}
                  onMouseDown={() => setLastMovedEntityId(entityData.entity.id)}
                  style={{ position: "absolute" }}
                >
                  <DraggableEntity
                    key={entityData.entity.id}
                    id={entityData.entity.id}
                    ept={entityData}
                    zIndex={
                      lastMovedEntityId === entityData.entity.id
                        ? constant.GAME_TABLE_SELECTED_ENTITY_ZINDEX
                        : constant.GAME_TABLE_ZINDEX
                    }
                    bounds={{
                      minX: 0,
                      minY: 0,
                      maxX: tableSize.width,
                      maxY: tableSize.height,
                    }}
                    updateEntity={updateEntity}
                    addModifier={addModifier}
                    removeEntity={removeEntityFromGameBoard}
                    autoEdit={newEntityId === entityData.entity.id}
                    onEditComplete={() => setNewEntityId(null)}
                  />
                </div>
              ))}
            </div>
          </TransformComponent>
          </div>
        </ContextMenuWrapper>
      </DndContext>


    </>
  );
}

const iconStyle: React.CSSProperties = {
  width: "20px",
  height: "20px",
  marginRight: "8px",
};
