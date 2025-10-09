import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

let activeMenu: {
  id: string;
  x: number;
  y: number;
  props?: any;
} | null = null;

let setActiveMenuState: ((menu: typeof activeMenu) => void) | null = null;

const registeredMenus = new Map<string, ReactNode>();

function showContextMenu({ event, id, props }: { event: React.MouseEvent; id: string; props?: any }) {
  event.preventDefault();
  event.stopPropagation();
  activeMenu = {
    id,
    x: event.clientX,
    y: event.clientY,
    props,
  };
  setActiveMenuState?.(activeMenu);
}

function hideContextMenu() {
  activeMenu = null;
  setActiveMenuState?.(null);
}

export function ContextMenuManager() {
  const [currentMenu, setCurrentMenu] = useState<typeof activeMenu>(null);
  
  useEffect(() => {
    setActiveMenuState = setCurrentMenu;
    return () => { setActiveMenuState = null; };
  }, []);

  useEffect(() => {
    const handleClick = () => hideContextMenu();
    const handleScroll = () => hideContextMenu();
    
    if (currentMenu) {
      document.addEventListener("click", handleClick);
      document.addEventListener("scroll", handleScroll, true);
      return () => {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [currentMenu]);

  if (!currentMenu) return null;

  return <ContextMenuPortal {...currentMenu} />;
}

function ContextMenuPortal({ id, x, y }: {
  id: string;
  x: number;
  y: number;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = x;
      let newY = y;
      
      if (x + rect.width > viewportWidth) {
        newX = viewportWidth - rect.width - 8;
      }
      
      if (y + rect.height > viewportHeight) {
        newY = viewportHeight - rect.height - 8;
      }
      
      setPosition({ x: newX, y: newY });
    }
  }, [x, y]);

  const menu = registeredMenus.get(id);
  if (!menu) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 10000,
        background: "rgba(46, 43, 41, 0.95)",
        border: "1px solid #68ff03ff",
        borderRadius: "4px",
        minWidth: "150px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {menu}
    </div>,
    document.body
  );
}

export function Menu({ id, children }: { id: string; children: ReactNode }) {
  useEffect(() => {
    registeredMenus.set(id, children);
    return () => registeredMenus.delete(id);
  }, [id, children]);
  
  return null;
}

export function Item({ 
  children, 
  onClick, 
  disabled = false 
}: { 
  children: ReactNode; 
  onClick?: (params?: { props?: any; triggerEvent?: MouseEvent }) => void;
  disabled?: boolean;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    hideContextMenu();
    if (typeof onClick === 'function') {
      if (onClick.length === 0) {
        onClick();
      } else {
        onClick({ props: {}, triggerEvent: e.nativeEvent });
      }
    }
  };

  return (
    <div
      style={{
        padding: "8px 12px",
        color: disabled ? "#666" : "white",
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = "rgba(104, 255, 3, 0.2)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </div>
  );
}

export function Submenu({ 
  label, 
  children 
}: { 
  label: string; 
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={submenuRef}
      style={{ position: "relative" }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        style={{
          padding: "8px 12px",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "14px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(104, 255, 3, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        {label}
        <span style={{ marginLeft: "8px" }}>▶</span>
      </div>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            left: "100%",
            top: 0,
            background: "rgba(46, 43, 41, 0.95)",
            border: "1px solid #68ff03ff",
            borderRadius: "4px",
            minWidth: "150px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            zIndex: 10001,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function useContextMenu({ id }: { id: string }) {
  return {
    show: (params: { event: React.MouseEvent; id?: string; props?: any }) => 
      showContextMenu({ ...params, id: params.id || id }),
  };
}