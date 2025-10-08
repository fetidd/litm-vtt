import React, { useContext } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Entity, ModifierEntity } from "../../litm/entity";
import { Tag as LitmTag } from "../../litm/tag";
import { Status as LitmStatus } from "../../litm/status";
import { useTransformContext } from "react-zoom-pan-pinch";
import Tag from "../Tag";
import constant from "../../constants";
import Status from "../Status";
import {
  Item,
  Menu,
  Submenu,
  useContextMenu,
  type ItemParams,
  type TriggerEvent,
} from "react-contexify";
import { type EntityPositionData } from "../../types";
import {
  ArrowDownIcon,
  FireIcon,
  MinusIcon,
  PencilIcon,
  StrikethroughIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import { createPortal } from "react-dom";
import { UserContext } from "@/App";

type DraggableEntityProps = {
  id: string;
  ept: EntityPositionData;
  zIndex: number;
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  editing: boolean;
  updateEntity: (id: string, updater: (ent: Entity) => Entity) => void;
  setEditing: (id: string | undefined) => void;
  addModifier: (
    entity: ModifierEntity,
    polarity: "add" | "subtract",
    isBurned: boolean,
  ) => void;
  removeEntity: (entity: Entity) => void;
};

export function DraggableEntity({
  id,
  ept,
  zIndex,
  bounds,
  editing,
  updateEntity,
  setEditing,
  addModifier,
  removeEntity,
}: DraggableEntityProps) {
  const { entity, position } = ept;
  const { x, y } = position;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const transformContext = useTransformContext();
  const xOffset =
    transform == null ? 0 : transform.x / transformContext.transformState.scale;
  const yOffset =
    transform == null ? 0 : transform.y / transformContext.transformState.scale;
  const { xBound, yBound } = getEntityComponentBounds(entity);
  const left = Math.min(
    Math.max(x + xOffset, bounds.minX),
    bounds.maxX - xBound,
  );
  const top = Math.min(
    Math.max(y + yOffset, bounds.minY),
    bounds.maxY - yBound,
  );

  const user = useContext(UserContext);
  const isMine = user?.username == entity.owner || user?.role == "narrator";

  const style: React.CSSProperties = {
    boxShadow: "8px 8px 20px rgba(0, 0, 0, 0.47)",
    position: "absolute",
    left: left,
    top: top,
    cursor: isMine ? "grab" : "default",
    userSelect: "none",
    zIndex: zIndex,
    touchAction: "none",
  };

  const MENU_ID = `draggable-entity-menu-${entity.id}`;
  const { show } = useContextMenu({ id: MENU_ID });
  function displayContextMenu(e: TriggerEvent) {
    e.stopPropagation();
    show({
      event: e,
      id: MENU_ID,
      props: {
        entity: entity,
      },
    });
  }

  const draggableAttrs = { ...listeners, ...attributes };
  let wrapperAttrs = {
    className: "draggable-entity",
    ref: setNodeRef,
    style: style,
    onContextMenu: displayContextMenu,
  };
  if (isMine) {
    wrapperAttrs = { ...wrapperAttrs, ...draggableAttrs };
  }
  return (
    <>
      <div {...wrapperAttrs}>
        {entity.entityType == "tag" && (
          <Tag
            tag={entity as LitmTag}
            editing={editing}
            setEditing={setEditing}
            updateEntity={updateEntity}
            addModifier={addModifier}
            removeEntity={removeEntity}
          />
        )}
        {entity.entityType == "status" && (
          <Status
            status={entity as LitmStatus}
            editing={editing}
            setEditing={setEditing}
            updateEntity={updateEntity}
            addModifier={addModifier}
            removeEntity={removeEntity}
          />
        )}
        {entity.entityType == "story-theme" && (
          <Tag
            tag={entity as LitmTag}
            editing={editing}
            setEditing={setEditing}
            updateEntity={updateEntity}
            addModifier={addModifier}
            removeEntity={removeEntity}
          />
        )}
      </div>
    </>
  );
}

function getEntityComponentBounds(entity: Entity): {
  xBound: number;
  yBound: number;
} {
  switch (entity.entityType) {
    case "tag": {
      return {
        xBound: entity.name.length * constant.TAG_CHAR_WIDTH_MULTIPLIER,
        yBound: constant.TAG_HEIGHT,
      };
    }
    case "story-theme": {
      return {
        xBound: entity.name.length * constant.TAG_CHAR_WIDTH_MULTIPLIER,
        yBound: constant.TAG_HEIGHT,
      };
    }
    case "status": {
      return {
        xBound: entity.name.length * constant.TAG_CHAR_WIDTH_MULTIPLIER,
        yBound: constant.STATUS_HEIGHT,
      };
    }
    default: {
      throw Error();
    }
  }
}
