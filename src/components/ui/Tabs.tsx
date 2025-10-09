interface TabsProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div style={{ display: "flex", background: "rgba(30, 30, 30, 1)", borderBottom: "1px solid #555" }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: "8px 12px",
            background: activeTab === tab.id ? "rgba(104, 255, 3, 0.2)" : "transparent",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}