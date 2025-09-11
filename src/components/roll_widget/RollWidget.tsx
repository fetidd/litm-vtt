import React, { useEffect, useState } from "react";
import RollWidgetLog from "./RollWidgetLog";
import RollWidgetInput from "./RollWidgetInput";
import type Modifier from "../../litm/modifier";
import Entity from "../../litm/entity";

type RollMessage = {
    id: number;
    text: string;
};

type Props = {
    entities: Entity[],
    handleRemoveModifier: (modId: string) => void;
}

export default function RollWidget({ entities, handleRemoveModifier }: Props) {
    const [rollMessages, setRollMessages] = useState<RollMessage[]>([]);
    const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>(entities.map(e => ({
        entity: e,
        value: 1,
        polarity: 'add'
    })));

    useEffect(() => {
        setSelectedModifiers(entities.map(e => ({
            entity: e,
            value: 1,
            polarity: 'add'
        })));
    }, [entities]);

    const handleRoll = () => { // TODO move to server
        // Simulate a dice roll and message
        const rolls = [(Math.floor(Math.random() * 6) + 1), (Math.floor(Math.random() * 6) + 1)];
        let total = rolls.reduce((a, b) => a + b, 0);
        for (const mod of selectedModifiers) {
            if (mod.polarity === 'add') {
                total += mod.value;
            } else {
                total -= mod.value;
            }
        }
        const modifierText = selectedModifiers.map(m => m.entity.name).join(", ");
        const message = `Rolled: ${total} (${rolls.join(", ")})${modifierText ? " (" + modifierText + ")" : ""}`;
        setRollMessages([
            ...rollMessages,
            { id: Date.now(), text: message }
        ]);
        setSelectedModifiers([]); // clear modifiers after roll
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
                selectedModifiers={selectedModifiers}
                onRoll={handleRoll}
                handleModifierRemove={handleRemoveModifier}
            />
        </div>
    );
}