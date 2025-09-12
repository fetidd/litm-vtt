import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Entity } from "../../litm/entity";
import { useTransformContext } from "react-zoom-pan-pinch";

type DraggableEntityProps = {
    id: string;
    entity: Entity;
    x: number;
    y: number;
    height: number;
};

export function DraggableEntity({ id, entity, x, y, height}: DraggableEntityProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });
    const transformContext = useTransformContext();
    const xOffset = transform == null ? 0 : transform.x / transformContext.transformState.scale;
    const yOffset = transform == null ? 0 : transform.y / transformContext.transformState.scale;

    const style: React.CSSProperties = {
        background: "#fff9a6",
        border: "1px solid #e6c200",
        borderRadius: "4px",
        padding: "6px 6px",
        minWidth: "80px",
        // maxWidth: "200px",
        fontSize: "1rem",
        color: "#333",
        boxShadow: "8px 8px 20px rgba(0, 0, 0, 0.47)",
        position: "absolute",
        left: x + xOffset,
        top: y + yOffset,
        cursor: "grab",
        userSelect: "none",
        display: "flex",
        zIndex: height,
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
            <span style={{}}>{entity.name}</span>
        </div>
    )
}

