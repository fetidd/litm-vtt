import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Entity } from "../../litm/entity";
import { Tag as LitmTag } from "../../litm/tag";
import { useTransformContext } from "react-zoom-pan-pinch";
import Tag from "../Tag";
import Theme from "../Theme";
import Status from "../Status";
import { TAG_CHAR_WIDTH_MULTIPLIER, TAG_HEIGHT } from "../../constants";

type DraggableEntityProps = {
    id: string;
    entity: Entity;
    x: number;
    y: number;
    zIndex: number;
    bounds: { minX: number, minY: number, maxX: number, maxY: number };
};

export function DraggableEntity({ id, entity, x, y, zIndex, bounds }: DraggableEntityProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });
    const transformContext = useTransformContext();
    const xOffset = transform == null ? 0 : transform.x / transformContext.transformState.scale;
    const yOffset = transform == null ? 0 : transform.y / transformContext.transformState.scale;
    const { component, xBound, yBound } = getEntityComponent(entity);
    const left = Math.min(Math.max(x + xOffset, bounds.minX), bounds.maxX - xBound);
    const top = Math.min(Math.max(y + yOffset, bounds.minY), bounds.maxY - yBound);

    const style: React.CSSProperties = {
        boxShadow: "8px 8px 20px rgba(0, 0, 0, 0.47)",
        position: "absolute",
        left: left,
        top: top,
        cursor: "grab",
        userSelect: "none",
        zIndex: zIndex,
        touchAction: "none",
    };


    return (
        <div
            className="draggable-entity"
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            {component}
        </div>
    )
}

function getEntityComponent(entity: Entity): {component: any, xBound: number, yBound: number} {
    switch (entity.entityType) {
        case "tag":
            return { component: <Tag tag={ entity as LitmTag }/>, xBound: entity.name.length*TAG_CHAR_WIDTH_MULTIPLIER, yBound: TAG_HEIGHT}
        case "theme":
            return { component: <Theme />, xBound: 200, yBound: 40}
        case "status":
            return { component: <Status />, xBound: 200, yBound: 40}
        default:
            return { component: <div>{entity.entityType}</div>, xBound: 0, yBound: 0}
    }
}

