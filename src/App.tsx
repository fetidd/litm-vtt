import "../assets/index.css";

import { GameTable } from "./components/game_table/GameTable";
import { Entity, ModifierEntity } from "./litm/entity";
import { createContext, useEffect, useState, type Context } from "react";
import RollWidget from "./components/roll_widget/RollWidget";
import type Modifier from "./litm/modifier";
import type User from "./user";
import { TransformWrapper } from "react-zoom-pan-pinch";
import type { EntityPositionData } from "./types";
import { handleRollResponse } from "./handlers/rollResponse";
import { handleUpdateClientGameTableEntityPosition } from "./handlers/updateClientGameTableEntityPosition";
import { handleClientGameTableEntitySync } from "./handlers/clientGameTableEntitySync";
import { handleUpdateClientGameTableEntityDetails } from "./handlers/updateClientGameTableEntityDetails";
import {
  Item,
  Menu,
  useContextMenu,
  type TriggerEvent,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import Drawer from "./components/drawer/Drawer";
import { handleClientDrawerEntitySync } from "./handlers/clientDrawerEntitySync";
import ResizeHandle from "./components/ResizeHandle";
import CircularResizeHandle from "./components/CircularResizeHandle";

export const UserContext: Context<User | null> = createContext(
  null as User | null,
);

export function App() {
  const [user, setUser] = useState<User>({
    username: "ben",
    role: "narrator",
  } as User);

  // STATE - this will probably need to become context provided soon, this feels like a lot...
  const [gameTableEntities, setGameTableEntities] = useState<
    EntityPositionData[]
  >([]);
  const [drawerEntities, setDrawerEntities] = useState<Entity[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [rollMessages, setRollMessages] = useState<
    { id: string; text: string }[]
  >([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [drawerHeight, setDrawerHeight] = useState(() => {
    const saved = localStorage.getItem('drawerHeight');
    return saved ? parseInt(saved) : 200;
  });
  const [rollWidgetWidth, setRollWidgetWidth] = useState(() => {
    const saved = localStorage.getItem('rollWidgetWidth');
    return saved ? parseInt(saved) : 300;
  });

  // WEBSOCKET HANDLING
  useEffect(() => {
    // const webSocket = new WebSocket("https://litm-vtt.fly.dev/");
    const webSocket = new WebSocket("ws://localhost:3000/");
    setWs(webSocket);
    webSocket.onmessage = function (event) {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "updateGameTableEntityPosition": {
          handleUpdateClientGameTableEntityPosition(
            message,
            setGameTableEntities,
          );
          break;
        }
        case "updateGameTableEntityDetails": {
          handleUpdateClientGameTableEntityDetails(
            message,
            setGameTableEntities,
          );
          break;
        }
        case "gameTableEntitySync": {
          handleClientGameTableEntitySync(message, setGameTableEntities);
          break;
        }
        case "drawerEntitySync": {
          handleClientDrawerEntitySync(message, setDrawerEntities);
          break;
        }
        case "rollResponse": {
          handleRollResponse(message, setRollMessages);
          break;
        }
        default: {
          console.warn(`Unknown message type: ${message.type}`);
        }
      }
    };
    return () => {
      webSocket.close();
    };
  }, []);

  const style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `1fr 8px ${rollWidgetWidth}px`,
    gridTemplateRows: `1fr 8px ${drawerHeight}px`,
    gridTemplateAreas: `
      "game-table width-resize-handle roll-widget"
      "resize-handle width-resize-handle roll-widget"
      "drawer width-resize-handle roll-widget"
    `,
    height: "100vh",
    padding: "4px",
    columnGap: "4px",
    rowGap: "4px",
    boxSizing: "border-box",
  };

  const handleHeightMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = drawerHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startY - e.clientY;
      const maxHeight = window.innerHeight * 0.75;
      const newHeight = Math.max(100, Math.min(maxHeight, startHeight + deltaY));
      setDrawerHeight(newHeight);
      localStorage.setItem('drawerHeight', newHeight.toString());
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleWidthMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rollWidgetWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = startX - e.clientX;
      const maxWidth = window.innerWidth * 0.75;
      const newWidth = Math.max(200, Math.min(maxWidth, startWidth + deltaX));
      setRollWidgetWidth(newWidth);
      localStorage.setItem('rollWidgetWidth', newWidth.toString());
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleBothMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = rollWidgetWidth;
    const startHeight = drawerHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = startX - e.clientX;
      const deltaY = startY - e.clientY;
      const maxWidth = window.innerWidth * 0.75;
      const maxHeight = window.innerHeight * 0.75;
      const newWidth = Math.max(200, Math.min(maxWidth, startWidth + deltaX));
      const newHeight = Math.max(100, Math.min(maxHeight, startHeight + deltaY));
      setRollWidgetWidth(newWidth);
      setDrawerHeight(newHeight);
      localStorage.setItem('rollWidgetWidth', newWidth.toString());
      localStorage.setItem('drawerHeight', newHeight.toString());
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const MENU_ID = "menu-id";
  const { show } = useContextMenu({ id: MENU_ID });
  function displayContextMenu(e: TriggerEvent) {
    show({
      event: e,
      id: MENU_ID,
    });
  }

  function addModifier(
    entity: ModifierEntity,
    polarity: "add" | "subtract",
    isBurned: boolean,
  ) {
    setSelectedModifiers((prev) =>
      !prev.find((e) => e.entity.id === entity.id)
        ? [...prev, { entity, isBurned, polarity }]
        : prev,
    );
  }

  if (user) {
    return (
      <div className="app" style={{...style, position: "relative"}} onContextMenu={displayContextMenu}>
        <UserContext value={user}>
          <div style={{ gridArea: "game-table", overflow: "hidden", height: "100%" }}>
            <TransformWrapper
              panning={{
                excluded: ["draggable-entity"],
                allowLeftClickPan: false,
                allowRightClickPan: false,
                velocityDisabled: true,
              }}
              minScale={1}
              maxScale={1}
              centerZoomedOut={true}
              disablePadding={true}
            >
              <GameTable
                websocket={ws}
                gameTableEntities={gameTableEntities}
                setGameTableEntities={setGameTableEntities}
                addModifier={addModifier}
              />
            </TransformWrapper>
          </div>
          <ResizeHandle 
            direction="horizontal" 
            gridArea="width-resize-handle" 
            onMouseDown={handleWidthMouseDown} 
          />
          <ResizeHandle 
            direction="vertical" 
            gridArea="resize-handle" 
            onMouseDown={handleHeightMouseDown} 
          />
          <CircularResizeHandle 
            rollWidgetWidth={rollWidgetWidth}
            drawerHeight={drawerHeight}
            onMouseDown={handleBothMouseDown}
          />
          <div style={{ gridArea: "drawer", overflow: "hidden", height: "100%" }}>
            <TransformWrapper
              panning={{
                excluded: ["draggable-entity"],
                allowLeftClickPan: false,
                allowRightClickPan: false,
                velocityDisabled: true,
              }}
              minScale={1}
              maxScale={1}
              centerZoomedOut={true}
              disablePadding={true}
            >
              <Drawer
                websocket={ws}
                entities={drawerEntities}
                viewing={"hero"}
                addModifier={addModifier}
              />
            </TransformWrapper>
          </div>
          <div style={{ gridArea: "roll-widget" }}>
            <RollWidget
              websocket={ws}
              rollMessages={rollMessages}
              modifiers={selectedModifiers}
              handleRemoveModifier={(id: string) =>
                setSelectedModifiers((prev) =>
                  prev.filter((e) => e.entity.id !== id),
                )
              }
              clearModifiers={() => setSelectedModifiers([])}
            />
          </div>
        </UserContext>

        <Menu id={MENU_ID}>
          <Item disabled>Top level</Item>
        </Menu>
      </div>
    );
  } else return <div>LOGIN</div>;
}

export default App;
