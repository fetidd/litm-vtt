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
    bounds: {minX: number, minY: number, maxX: number, maxY: number};
};

export function DraggableEntity({ id, entity, x, y, height, bounds}: DraggableEntityProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });
    const transformContext = useTransformContext();
    const xOffset = transform == null ? 0 : transform.x / transformContext.transformState.scale;
    const yOffset = transform == null ? 0 : transform.y / transformContext.transformState.scale;
    const left = Math.min(Math.max(x + xOffset, bounds.minX), bounds.maxX - 200);
    const top = Math.min(Math.max(y + yOffset, bounds.minY), bounds.maxY - 40);

    const style: React.CSSProperties = {
        background: "#fff9a6",
        border: "1px solid #e6c200",
        borderRadius: "4px",
        width: "200px",
        height: "40px",
        // maxWidth: "200px",
        fontSize: "1rem",
        color: "#333",
        boxShadow: "8px 8px 20px rgba(0, 0, 0, 0.47)",
        position: "absolute",
        left: left,
        top: top,
        cursor: "grab",
        userSelect: "none",
        // display: "flex",
        zIndex: height,
        touchAction: "none",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center"
    };

    return (
        <div 
            className="draggable-entity"
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}
        >
            <span style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>{entity.name}</span>
        </div>
    )
}

