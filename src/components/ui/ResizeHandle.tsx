interface ResizeHandleProps {
  direction: "horizontal" | "vertical";
  gridArea: string;
  onMouseDown: (e: React.MouseEvent) => void;
}

export default function ResizeHandle({ direction, gridArea, onMouseDown }: ResizeHandleProps) {
  const isHorizontal = direction === "horizontal";
  
  return (
    <div 
      style={{ 
        gridArea,
        cursor: isHorizontal ? "ew-resize" : "ns-resize",
        backgroundColor: "#68ff03ff",
        border: "1px solid #68ff03ff",
        borderRadius: "2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onMouseDown={onMouseDown}
    >
      <div style={{ 
        width: isHorizontal ? "2px" : "20px", 
        height: isHorizontal ? "20px" : "2px", 
        backgroundColor: "#fff", 
        borderRadius: "1px" 
      }} />
    </div>
  );
}