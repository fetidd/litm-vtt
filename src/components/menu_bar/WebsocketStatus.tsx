interface WebsocketStatusProps {
  connected: boolean;
  sessionCode: string | null;
}

export default function WebsocketStatus({ connected, sessionCode }: WebsocketStatusProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <span style={{ fontSize: "14px" }}>Session: {sessionCode}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: connected ? "#4CAF50" : "#F44336",
          }}
        ></div>
        <span style={{ fontSize: "14px" }}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  );
}