import type React from "react";
import type { Entity, ModifierEntity } from "../../litm/entity";
import { ArrowDownIcon, FireIcon, PencilIcon, StrikethroughIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import type { StateSetter } from "@/types";
import type { Status } from "@/litm/status";
import constants from "@/constants";
import { PlusIcon } from "@heroicons/react/24/solid";
import { MinusIcon } from "@heroicons/react/24/solid";

type Props = {
    entity: ModifierEntity;
    addModifier: (entity: ModifierEntity, polarity: 'add' | 'subtract', isBurned: boolean) => void;
    removeEntity: (entity: Entity) => void;
    setEditing: StateSetter<string | undefined>;
    updateEntity: (id: string, updater: (ent: Entity) => Entity) => void;
}

export default function ModifierContextMenu({ entity, addModifier, removeEntity, setEditing, updateEntity }: Props) {
    const itemStyle: React.CSSProperties = {
        display: "flex",
        alignContent: "center",
        padding: "2px",
        borderRadius: "4px",
    }
    const iconStyle: React.CSSProperties = {
        width: "20px",
        height: "20px",
        marginRight: "8px"
    }

    const [hovered, setHovered] = useState("");
    function generateMenuItem(hoverId: string, onClick: (ev: React.MouseEvent) => void, icon: any, text: string) {
        return (
            <div
                style={{ ...itemStyle, background: hovered == hoverId ? "rgba(243, 203, 185, 0.96)" : "transparent" }}
                onClick={onClick}
                onMouseEnter={() => setHovered(hoverId)}
                onMouseLeave={() => setHovered("")}
                key={hoverId}
            >
                {icon}
                {text}
            </div>
        )
    }

    const items = [];
    if (entity.entityType === "status") {
        items.push(<div
            style={{ ...itemStyle, flexDirection: "row", justifyContent: "space-between" }}
            key="tiers"
        >
            {[1, 2, 3, 4, 5, 6].map(n => {
                return (
                    <span
                        key={n}
                        style={{
                            padding: "0 5px",
                            background: (entity as Status).hasTier(n) ? constants.STATUS_COLOR : "transparent",
                            border: `solid 4px ${hovered == `tier-${n}` ? constants.STATUS_COLOR : "transparent"}`,
                            borderRadius: "4px"
                        }}
                        onClick={(ev: React.MouseEvent) => {updateEntity(entity.id, (e) => {
                            ev.stopPropagation();
                            (e as Status).addTier(n);
                            return e;
                        })}}
                        onMouseEnter={() => setHovered(`tier-${n}`)}
                        onMouseLeave={() => setHovered("")}
                    >{n}</span>
                )
            })}
        </div>)
        items.push(generateMenuItem("decrease", (ev: React.MouseEvent) => {ev.stopPropagation(); updateEntity(entity.id, (e) => { (e as Status).decreaseTier((entity as Status).value > 1 ? 1 : 0); return e; })}, <ArrowDownIcon style={iconStyle} />, "Decrease tier"))
    }
    if (entity.canBurn && !entity.isScratched) {
        items.push(generateMenuItem("burn", (ev: React.MouseEvent) => addModifier(entity, 'add', true), <FireIcon style={iconStyle} />, `Burn ${entity.entityType}`))
    }
    if (entity.canScratch) {
        items.push(generateMenuItem(`${entity.isScratched ? "un" : ""}scratch`, (ev: React.MouseEvent) => updateEntity(entity.id, (e) => { (e as ModifierEntity).isScratched = !entity.isScratched; return e; }), <StrikethroughIcon style={iconStyle} />, `${entity.isScratched ? "Uns" : "S"}cratch ${entity.entityType}`))
    }
    if (!entity.isScratched) {
        items.push(generateMenuItem("add", (ev: React.MouseEvent) => addModifier(entity, 'add', false), <PlusIcon style={iconStyle} />, "Add positive modifier"))
        items.push(generateMenuItem("neg", (ev: React.MouseEvent) => addModifier(entity, 'subtract', false), <MinusIcon style={iconStyle} />, "Add negative modifier"))
    }
    items.push(generateMenuItem("edit", (ev: React.MouseEvent) => setEditing(entity.id), <PencilIcon style={iconStyle} />, `Edit ${entity.entityType}`))
    items.push(generateMenuItem("remove", (ev: React.MouseEvent) => removeEntity(entity), <TrashIcon style={iconStyle} />, `Remove ${entity.entityType}`))

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "8px",
            backgroundColor: "white",
            borderRadius: "4px",
            boxShadow: "100 50px 80px rgba(0, 0, 0, 1)",
            color: "#333",
        }}>
            {items}
        </div>
    )
}