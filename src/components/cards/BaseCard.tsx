import { CARD_STYLE } from "@/constants";
import { useState, useRef, useEffect, type ReactNode } from "react";
import Button from "../Button";

interface BaseCardProps {
  title: string;
  headerColor: string;
  entityId: string;
  frontContent: ReactNode;
  backContent: ReactNode;
  style?: React.CSSProperties;
}

export default function BaseCard({
  title,
  headerColor,
  entityId,
  frontContent,
  backContent,
  style = {},
}: BaseCardProps) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [isFlipping, setIsFlipping] = useState(false);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measureHeight = () => {
      if (frontRef.current && backRef.current) {
        const frontHeight = frontRef.current.offsetHeight;
        const backHeight = backRef.current.offsetHeight;
        const maxContentHeight = Math.max(frontHeight, backHeight);
        setCardHeight(maxContentHeight + 40); // +40 for header height
      }
    };
    
    setTimeout(measureHeight, 10);
  }, [frontContent, backContent]);

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
      height: cardHeight ? `${cardHeight}px` : 'auto',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
      transition: 'transform 0.1s linear'
    }}>
      <div
        style={{
          display: "flex",
          height: "40px",
          flexShrink: 0,
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
        </div>
      </div>
      {side === "front" && !isFlipping && <div style={{ padding: "12px", height: cardHeight ? `${cardHeight - 40}px` : 'auto', display: "flex", flexDirection: "column" }}>{frontContent}</div>}
      {side === "back" && !isFlipping && <div style={{ padding: "12px", height: cardHeight ? `${cardHeight - 40}px` : 'auto', display: "flex", flexDirection: "column" }}>{backContent}</div>}
      {!cardHeight && (
        <>
          <div ref={frontRef} style={{ padding: "12px", display: "flex", flexDirection: "column", visibility: "hidden", position: "absolute", width: "268px" }}>{frontContent}</div>
          <div ref={backRef} style={{ padding: "12px", display: "flex", flexDirection: "column", visibility: "hidden", position: "absolute", width: "268px" }}>{backContent}</div>
        </>
      )}
    </div>
  );
}