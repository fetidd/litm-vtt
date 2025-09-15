import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Entity, type EntityType } from '../../litm/entity';
import { Tag as LitmTag } from "../../litm/tag";
import { StoryTheme as LitmStoryTheme } from "../../litm/theme"
import { Status as LitmStatus } from "../../litm/status"
import { useTransformContext } from "react-zoom-pan-pinch";
import Tag, { type TagProps } from "../Tag";
import Theme, { type ThemeProps } from "../Theme";
import constant from "../../constants";
import Status from "../Status";

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
    const { xBound, yBound } = getEntityComponentBounds(entity);
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
            {entity.entityType == "tag" && <Tag tag={entity as LitmTag} />}
            {entity.entityType == "story-theme" && <Theme theme={entity as LitmStoryTheme} />}
            {entity.entityType == "status" && <Status status={entity as LitmStatus} />}
        </div>
    )
}

function getEntityComponentBounds(entity: Entity): {xBound: number, yBound: number} {
    switch (entity.entityType) {
        case "tag":
            return {xBound: entity.name.length*constant.TAG_CHAR_WIDTH_MULTIPLIER, yBound: constant.TAG_HEIGHT}
        case "story-theme":
            return {xBound: entity.name.length*constant.TAG_CHAR_WIDTH_MULTIPLIER, yBound: constant.TAG_HEIGHT}
        case "status":
            return {xBound: entity.name.length*constant.TAG_CHAR_WIDTH_MULTIPLIER, yBound: constant.STATUS_HEIGHT}
        default:
            throw Error()
    }
}

