import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "header" | "content";
  style?: React.CSSProperties;
}

export default function Button({ 
  onClick, 
  children, 
  variant = "content",
  style = {} 
}: ButtonProps) {
  const baseStyle = {
    background: "transparent",
    border: "1px solid",
    borderRadius: "4px",
    padding: "4px 8px",
    cursor: "pointer",
  };

  const variantStyles = {
    header: {
      ...baseStyle,
      borderColor: "white",
      color: "white",
    },
    content: {
      ...baseStyle,
      borderColor: "#ccc",
      color: "black",
      margin: "2px",
    },
  };

  return (
    <button
      onClick={onClick}
      style={{ ...variantStyles[variant], ...style }}
    >
      {children}
    </button>
  );
}