import React, { useRef, useState, useEffect } from 'react';
import { useTransformContext } from 'react-zoom-pan-pinch';

type ContextMenuWrapperProps = {
    menu: React.ReactNode;
    children: React.ReactNode;
};

// TODO make this not change size when the gamnetable is zoomed!

export function ContextMenuWrapper({ menu, children }: ContextMenuWrapperProps) {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const transformContext = useTransformContext();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current) {
                if (!menuRef.current.contains(e.target as Node)) {
                    setVisible(false);
                } else {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        };
        if (visible) {
            document.addEventListener('mousedown', handleClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [visible]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPos({ x: (e.clientX - transformContext.transformState.positionX) / transformContext.transformState.scale, y: (e.clientY - transformContext.transformState.positionY) / transformContext.transformState.scale });
        setVisible(true);
    };

    const closeContextMenu = () => {
        setVisible(false);
    }

    return (
        <div style={{}} onContextMenu={handleContextMenu}>
            {children}
            {visible && (
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        top: pos.y,
                        left: pos.x,
                        zIndex: 1000,
                        background: 'transparent',
                        boxShadow: '4 2px 8px rgba(0,0,0,0.15)',
                        minWidth: 120,
                        cursor: "pointer"
                    }}
                    onClick={closeContextMenu}
                >
                    {menu}
                </div>
            )}
        </div>
    );
};