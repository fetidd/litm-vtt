import { useState } from "react";

interface QuestProps {
  quest: string;
  onUpdate: (quest: string) => void;
}

export default function Quest({
  quest,
  onUpdate,
}: QuestProps) {
  const [editing, setEditing] = useState(false);
  return editing ? (
    <textarea
      value={quest}
      onChange={(e) => onUpdate(e.target.value)}
      style={{ padding: "4px", margin: "4px", resize: "vertical", minHeight: "60px" }}
    />
  ) : (
    <div style={{ padding: "4px", margin: "4px 0px", resize: "vertical", minHeight: "60px", fontStyle: "italic" }}>{`"${quest}"`}</div>
  );
}