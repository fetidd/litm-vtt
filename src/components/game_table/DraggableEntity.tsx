import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

import LitmEntity from "../../litm/entity";

type DraggableEntityProps = {
    id: string;
    entity: LitmEntity;
    x: number;
    y: number;
    height: number;
    handleClick: (entity: LitmEntity) => void;
};

export function DraggableEntity({ id, entity, x, y, height, handleClick }: DraggableEntityProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

    const style: React.CSSProperties = {
        background: "#fff9a6",
        border: "1px solid #e6c200",
        borderRadius: "4px",
        padding: "6px 18px",
        minWidth: "80px",
        maxWidth: "200px",
        fontSize: "1rem",
        color: "#333",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        position: "absolute",
        left: x + (transform?.x ?? 0),
        top: y + (transform?.y ?? 0),
        cursor: "grab",
        userSelect: "none",
        display: "inline-block",
        zIndex: height,
        touchAction: "none",
    };

    return (
        <div ref={setNodeRef} onMouseDown={() => handleClick(entity)} style={style} {...listeners} {...attributes}>
            {entity.name}
        </div>
    )
}

