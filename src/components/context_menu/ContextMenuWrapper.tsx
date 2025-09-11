import React, { useRef, useState, useEffect } from 'react';

type ContextMenuWrapperProps = {
    menu: React.ReactNode;
    children: React.ReactNode;
};

export const ContextMenuWrapper: React.FC<ContextMenuWrapperProps> = ({ menu, children }) => {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

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
        setPos({ x: e.clientX, y: e.clientY });
        setVisible(true);
    };

    return (
        <div style={{ display: 'inline-block', position: 'relative' }} onContextMenu={handleContextMenu}>
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
                    }}
                >
                    {menu}
                </div>
            )}
        </div>
    );
};