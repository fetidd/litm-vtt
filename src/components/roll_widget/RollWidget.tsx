import React, { useEffect, useState } from "react";
import RollWidgetLog from "./RollWidgetLog";
import RollWidgetInput from "./RollWidgetInput";
import Modifier from "../../litm/modifier";
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
        value: 0,
        polarity: 'add'
    })));

    useEffect(() => {
        setSelectedModifiers(entities.map(e => ({
            entity: e,
            value: 0,
            polarity: 'add'
        })));
    }, [entities]);

    const handleModifierRemove = (modId: string) => {
        setSelectedModifiers(selectedModifiers.filter(m => m.entity.id !== modId));
    };

    const handleRoll = () => { // TODO move to server
        // Simulate a dice roll and message
        const rolls = [(Math.floor(Math.random() * 6) + 1), (Math.floor(Math.random() * 6) + 1)];
        const total = rolls.reduce((a, b) => a + b, 0);
        const modifierText = selectedModifiers.map(m => m.entity.name).join(", ");
        const message = `Rolled: ${total} (${rolls.join(", ")})${modifierText ? " (" + modifierText + ")" : ""}`;
        setRollMessages([
            ...rollMessages,
            { id: Date.now(), text: message }
        ]);
    };

    return (
        <div
            id="roll-widget"
            style={{
                position: "relative",
                height: "1000px",
                border: "2px solid #68ff03ff",
                overflow: "hidden",
                margin: "20px",
                width: "20%",
                boxSizing: "border-box",
                padding: "10px",
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