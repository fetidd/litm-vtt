export default function RollWidgetLog({rollMessages}: Props) {
    return (
        <div
            id="roll-widget-log"
            style={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "10px",
                background: "#222",
                color: "#fff",
                borderRadius: "4px",
                padding: "8px",
            }}
        >
            {rollMessages.length === 0 ? (
                <div style={{ color: "#888" }}>No rolls yet.</div>
            ) : (
                rollMessages.map(msg => (
                    <div key={msg.id} style={{ marginBottom: "6px" }}>
                        {msg.text}
                    </div>
                ))
            )}
        </div>
    );
}

type Props = {
    rollMessages: { id: number; text: string }[];
};