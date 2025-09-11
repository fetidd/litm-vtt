import Modifier from '../../litm/modifier';
import Tag from '../../litm/tag';

export default function RollWidgetInput({
    selectedModifiers,
    handleModifierRemove,
    onRoll
}: Props) {
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
                                        background: "#ffe066",
                                        border: "1px solid #e6c200",
                                        color: "#333",
                                        borderRadius: "4px",
                                        padding: "2px 8px",
                                        marginRight: "4px",
                                        fontSize: "0.95rem",
                                        display: "inline-block",
                                    }}
                                >
                                    {mod.entity.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    style={{
                        background: "#68ff03ff",
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
                    Roll
                </button>
            </div>
    );
}

type Props = {
    selectedModifiers: Modifier[];
    onRoll: () => void;
    handleModifierRemove: (tagId: string) => void;
};