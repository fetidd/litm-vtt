import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

import { Entity } from "../../litm/entity";
import { PlusIcon } from "@heroicons/react/16/solid";
import { ContextMenuWrapper } from "../context_menu/ContextMenuWrapper";
import ModifierContextMenu from "../context_menu/ModifierContextMenu";

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

    const style: React.CSSProperties = {
        background: "#fff9a6",
        border: "1px solid #e6c200",
        borderRadius: "4px",
        padding: "6px 6px",
        minWidth: "80px",
        // maxWidth: "200px",
        fontSize: "1rem",
        color: "#333",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        position: "absolute",
        left: x + (transform?.x ?? 0),
        top: y + (transform?.y ?? 0),
        cursor: "grab",
        userSelect: "none",
        display: "flex",
        zIndex: height,
        touchAction: "none",
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}
        >
            <span style={{}}>{entity.name}</span>
        </div>
    )
}

