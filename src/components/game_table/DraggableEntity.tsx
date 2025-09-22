import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Entity, ModifierEntity } from '../../litm/entity';
import { Tag as LitmTag } from "../../litm/tag";
import { Status as LitmStatus } from "../../litm/status"
import { useTransformContext } from "react-zoom-pan-pinch";
import Tag from "../Tag";
import constant from "../../constants";
import Status from "../Status";
import { Item, Menu, Submenu, useContextMenu, type ItemParams, type TriggerEvent } from "react-contexify";
import { type EntityPositionData } from '../../types';
import { ArrowDownIcon, FireIcon, MinusIcon, PencilIcon, StrikethroughIcon, TrashIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import { createPortal } from "react-dom";

type DraggableEntityProps = {
    id: string;
    ept: EntityPositionData,
    zIndex: number;
    bounds: { minX: number, minY: number, maxX: number, maxY: number };
    editable: boolean;
    updateEntity: (id: string, updater: (ent: Entity) => Entity) => void,
    setEditingEntity: (id: string | undefined) => void,
    addModifier: (entity: ModifierEntity, polarity: "add" | "subtract", isBurned: boolean) => void,
    removeEntity: (entity: Entity) => void,
};

export function DraggableEntity({ id, ept, zIndex, bounds, editable, updateEntity, setEditingEntity, addModifier, removeEntity }: DraggableEntityProps) {
    const { entity, position } = ept;
    const { x, y } = position;
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

    const MENU_ID = `draggable-entity-menu-${entity.id}`;
    const { show } = useContextMenu({ id: MENU_ID });
    function displayContextMenu(e: TriggerEvent) {
        e.stopPropagation()
        show({
            event: e,
            id: MENU_ID,
            props: {
                entity: entity
            }
        });
    }

    return (
        <>
            <div
                className="draggable-entity"
                ref={setNodeRef}
                style={style}
                onContextMenu={displayContextMenu}
                {...listeners}
                {...attributes}
            >
                {entity.entityType == "tag" && <Tag tag={entity as LitmTag} editing={editable} setEditing={setEditingEntity} updateEntity={updateEntity} />}
                {entity.entityType == "status" && <Status status={entity as LitmStatus} editing={editable} setEditing={setEditingEntity} updateEntity={updateEntity} />}
                {entity.entityType == "story-theme" && <Tag tag={entity as LitmTag} editing={editable} setEditing={setEditingEntity} updateEntity={updateEntity} />}
            </div>
            {createPortal(
                <Menu id={MENU_ID}>
                    {((entity as ModifierEntity).canBurn && !entity.isScratched) && <Item onClick={() => addModifier(entity as ModifierEntity, "add", true)}>{<FireIcon style={iconStyle} />}{`Burn ${entity.entityType}`}</Item>}

                    <Item onClick={() => addModifier(entity as ModifierEntity, "add", false)}>{<PlusIcon style={iconStyle} />}{`Add ${entity.entityType}`}</Item>
                    <Item onClick={() => addModifier(entity as ModifierEntity, "subtract", false)}>{<MinusIcon style={iconStyle} />}{`Subtract ${entity.entityType}`}</Item>

                    {entity.canScratch && <Item onClick={() => updateEntity(entity.id, (e) => { (e as ModifierEntity).isScratched = !entity.isScratched; return e; })}>{<StrikethroughIcon style={iconStyle} />} {`${entity.isScratched ? "Uns" : "S"}cratch ${entity.entityType}`}</Item>}

                    {entity.entityType == "status" && <Item closeOnClick={false} onClick={() => { updateEntity(entity.id, (e) => { (e as LitmStatus).decreaseTier((entity as LitmStatus).value > 1 ? 1 : 0); return e; }) }} >{<ArrowDownIcon style={iconStyle} />}Decrease tier</Item>}
                    {entity.entityType == "status" &&  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        {[1, 2, 3, 4, 5, 6].map(n => {
                            return (
                                <Item
                                    style={{
                                        border: (entity as LitmStatus).hasTier(n) ? `4px solid ${constant.STATUS_COLOR}` : "4px solid transparent",
                                        borderRadius: "4px"
                                    }}
                                    onClick={() => {
                                        updateEntity(entity.id, (e) => {
                                            (e as LitmStatus).addTier(n);
                                            return e;
                                        })
                                    }}
                                >{n}</Item>
                            )
                        })}
                    </div>}

                    <Item onClick={() => setEditingEntity(entity.id)}>{<PencilIcon style={iconStyle} />}Edit</Item>
                    <Item onClick={() => removeEntity(entity as Entity)}>{<TrashIcon style={iconStyle} />}Remove</Item>
                </Menu>,
                document.body
            )}
        </>
    )
}

const iconStyle: React.CSSProperties = {
    width: "20px",
    height: "20px",
    marginRight: "8px"
}

function getEntityComponentBounds(entity: Entity): { xBound: number, yBound: number } {
    switch (entity.entityType) {
        case "tag":
            { return { xBound: entity.name.length * constant.TAG_CHAR_WIDTH_MULTIPLIER, yBound: constant.TAG_HEIGHT } }
        case "story-theme":
            { return { xBound: entity.name.length * constant.TAG_CHAR_WIDTH_MULTIPLIER, yBound: constant.TAG_HEIGHT } }
        case "status":
            { return { xBound: entity.name.length * constant.TAG_CHAR_WIDTH_MULTIPLIER, yBound: constant.STATUS_HEIGHT } }
        default:
            { throw Error() }
    }
}

