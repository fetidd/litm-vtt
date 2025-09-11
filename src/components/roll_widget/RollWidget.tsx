import React, { useEffect, useState } from "react";
import RollWidgetLog from "./RollWidgetLog";
import RollWidgetInput from "./RollWidgetInput";
import type Modifier from "../../litm/modifier";
import { RollRequest } from "@/messaging/message";

type RollMessage = {
    id: string;
    text: string;
};

type Props = {
    websocket: WebSocket | null,
    rollMessages: { id: string; text: string }[],
    modifiers: Modifier[],
    handleRemoveModifier: (modId: string) => void;
    clearModifiers: () => void;
}

export default function RollWidget({ modifiers, rollMessages, handleRemoveModifier, clearModifiers, websocket }: Props) {
    const handleRoll = () => {
        // Simulate a dice roll and message
        const rolls = [(Math.floor(Math.random() * 6) + 1), (Math.floor(Math.random() * 6) + 1)];
        let total = rolls.reduce((a, b) => a + b, 0);
        let modifierText: string[] = [];
        for (const mod of modifiers) {
            if (mod.polarity === 'add') {
                const toAdd = mod.isBurned ? mod.entity.value * 3 : mod.entity.value;
                total += toAdd;
                modifierText.push(`+${toAdd} ${mod.entity.name}`)
            } else {
                total -= mod.entity.value;
                modifierText.push(`-${mod.entity.value} ${mod.entity.name}`)
            }
        }
        const message = `Rolled: ${total} (${rolls.join(", ")})${modifierText ? " (" + modifierText.join(", ") + ")" : ""}`;
        const rollMessage = new RollRequest(message);
        websocket?.send(JSON.stringify(rollMessage));
        clearModifiers(); // clear modifiers after roll
    };

    return (
        <div
            id="roll-widget"
            style={{
                position: "relative",
                height: "98vh",
                border: "2px solid #68ff03ff",
                overflow: "hidden",
                margin: "5px",
                width: "20%",
                boxSizing: "border-box",
                padding: "5px",
                fontSize: "1rem",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <RollWidgetLog rollMessages={rollMessages} />
            <RollWidgetInput
                selectedModifiers={modifiers}
                onRoll={handleRoll}
                handleModifierRemove={handleRemoveModifier}
            />
        </div>
    );
}