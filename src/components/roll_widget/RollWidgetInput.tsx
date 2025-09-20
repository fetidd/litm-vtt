import constants from '@/constants';
import type Modifier from '../../litm/modifier';

export default function RollWidgetInput({
    selectedModifiers,
    handleModifierRemove,
    onRoll
}: Props) {
    const totalModifier: number = selectedModifiers.map(mod => {
        if (mod.polarity === "add") {
            return (mod.isBurned ? mod.entity.value * 3 : mod.entity.value)
        } else {
            return mod.entity.value * -1
        }
    }).reduce((prev, curr) => {
        return prev + curr
    }, 0);
    const totalModifierText = `${totalModifier > 0 ? "+": ""}${totalModifier}`;
    return (
        <div
                id="roll-widget-input"
                style={{
                    // background: "#f9f9c6",
                    borderRadius: "4px",
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >   
                <strong>Modifiers:</strong>
                <div>
                    {selectedModifiers.length > 0 && (
                        <div style={{ marginBottom: "4px" }}>
                            {selectedModifiers.map(mod => (
                                <span
                                    key={mod.entity.id}
                                    onClick={() => handleModifierRemove(mod.entity.id)}
                                    style={{
                                        background: `${mod.entity.entityType == "tag" ? constants.TAG_COLOR : constants.STATUS_COLOR}`,
                                        border: "1px solid #rgba(255, 38, 0, 1)",
                                        color: "#333",
                                        borderRadius: "4px",
                                        padding: "2px 8px",
                                        marginRight: "4px",
                                        fontSize: "0.95rem",
                                        display: "inline-block",
                                        cursor: "pointer"
                                    }}
                                >
                                    {`${mod.entity.name} ${mod.polarity === "add" ? "+" : "-"}${mod.isBurned ? mod.entity.value*3 : mod.entity.value}`}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    style={{
                        background: "#af3814ff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "1rem",
                        marginTop: "4px",
                    }}
                    onClick={onRoll}
                >
                    {`Roll${totalModifier ? ` ${totalModifierText}` : ''}`}
                </button>
            </div>
    );
}

type Props = {
    selectedModifiers: Modifier[];
    onRoll: () => void;
    handleModifierRemove: (tagId: string) => void;
};