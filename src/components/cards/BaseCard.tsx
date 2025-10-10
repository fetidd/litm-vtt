import { CARD_STYLE } from "@/constants";
import { useState, useRef, useEffect, type ReactNode } from "react";
import Button from "../ui/Button";
import { Item, ContextMenuWrapper } from "@/components/ui/ContextMenu";
import { PencilIcon } from "@heroicons/react/24/solid";

interface BaseCardProps {
  title: string;
  headerColor: string;
  entityId: string;
  frontContent: ReactNode;
  backContent: ReactNode;
  style?: React.CSSProperties;
  onEditTheme?: (position: { x: number; y: number }) => void;
}

export default function BaseCard({
  title,
  headerColor,
  entityId,
  frontContent,
  backContent,
  style = {},
  onEditTheme,
}: BaseCardProps) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [isFlipping, setIsFlipping] = useState(false);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const headerHeight = 40;

  useEffect(() => {
    const measureHeight = () => {
      if (frontRef.current && backRef.current) {
        const frontHeight = frontRef.current.offsetHeight;
        const backHeight = backRef.current.offsetHeight;
        const maxContentHeight = Math.max(frontHeight, backHeight);
        setCardHeight(maxContentHeight + headerHeight); // +40 for header height
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

  const sideStyle: React.CSSProperties = { padding: "12px", height: cardHeight ? `${cardHeight - headerHeight}px` : 'auto', display: "flex", flexDirection: "column"};
  const flippingStyle: React.CSSProperties = { padding: "12px", display: "flex", flexDirection: "column", visibility: "hidden", position: "absolute", width: "268px"};

  return (
    <div style={{
      ...CARD_STYLE,
      ...style,
      height: cardHeight ? `${cardHeight}px` : 'auto',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
      transition: 'transform 0.1s linear'
    }}>
      <ContextMenuWrapper
        menu={onEditTheme ? (
          <Item onClick={(params) => {
            const x = params?.triggerEvent?.clientX || 200;
            const y = params?.triggerEvent?.clientY || 100;
            onEditTheme({ x: x + 8, y });
          }}>
            <PencilIcon style={{ width: "16px", height: "16px", marginRight: "8px" }} />
            Edit Theme
          </Item>
        ) : undefined}
      >
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
      </ContextMenuWrapper>
      {side === "front" && !isFlipping && <div style={sideStyle}>{frontContent}</div>}
      {side === "back" && !isFlipping && <div style={sideStyle}>{backContent}</div>}
      {!cardHeight && (
        <>
          <div ref={frontRef} style={flippingStyle}>{frontContent}</div>
          <div ref={backRef} style={flippingStyle}>{backContent}</div>
        </>
      )}
    </div>
  );
}