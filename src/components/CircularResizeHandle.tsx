interface CircularResizeHandleProps {
  rollWidgetWidth: number;
  drawerHeight: number;
  onMouseDown: (e: React.MouseEvent) => void;
}

export default function CircularResizeHandle({ rollWidgetWidth, drawerHeight, onMouseDown }: CircularResizeHandleProps) {
  return (
    <div 
      style={{
        position: "absolute",
        right: `${rollWidgetWidth + 12}px`,
        top: `calc(100vh - ${drawerHeight + 8 + 4}px)`,
        width: "24px",
        height: "24px",
        backgroundColor: "#68ff03ff",
        border: "2px solid #fff",
        borderRadius: "50%",
        cursor: "grab",
        zIndex: 10,
        transform: "translate(50%, -50%)"
      }}
      onMouseDown={onMouseDown}
    />
  );
}