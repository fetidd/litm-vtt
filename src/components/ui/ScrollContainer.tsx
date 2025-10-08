import React from "react";

interface ScrollContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function ScrollContainer({ children, style }: ScrollContainerProps) {
  return (
    <div
      style={{
        overflow: "auto",
        ...style,
      }}
      className="scroll-container"
    >
      {children}
    </div>
  );
}