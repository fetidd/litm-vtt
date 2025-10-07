import { CARD_STYLE } from "@/constants";
import { useState, type ReactNode } from "react";
import Button from "../Button";

interface BaseCardProps {
  title: string;
  headerColor: string;
  entityId: string;
  editing: string | undefined;
  setEditing: (id: string | undefined) => void;
  frontContent: ReactNode;
  backContent: ReactNode;
  style?: React.CSSProperties;
}

export default function BaseCard({
  title,
  headerColor,
  entityId,
  editing,
  setEditing,
  frontContent,
  backContent,
  style = {},
}: BaseCardProps) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setSide(side === "front" ? "back" : "front");
      setTimeout(() => setIsFlipping(false), 50);
    }, 50);
  };



  return (
    <div style={{
      ...CARD_STYLE,
      ...style,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
      transition: 'transform 0.1s linear'
    }}>
      <div
        style={{
          display: "flex",
          height: "40px",
          background: headerColor,
          color: "white",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 8px",
          border: "0 none",
          borderRadius: "4px",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>{title}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button onClick={handleFlip} variant="header">
            Flip
          </Button>
          <Button
            onClick={() => setEditing(editing === entityId ? undefined : entityId)}
            variant="header"
          >
            {editing === entityId ? "Done" : "Edit"}
          </Button>
        </div>
      </div>
      {side === "front" && !isFlipping && <div style={{ padding: "12px" }}>{frontContent}</div>}
      {side === "back" && !isFlipping && <div style={{ padding: "12px" }}>{backContent}</div>}
    </div>
  );
}