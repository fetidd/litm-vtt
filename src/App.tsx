import "../assets/index.css";

import { GameTable } from "./components/game_table/GameTable";
import { Entity, ModifierEntity } from "./litm/entity";
import { createContext, useEffect, useState, type Context } from "react";
import RollWidget from "./components/roll_widget/RollWidget";
import type Modifier from "./litm/modifier";
import type User from "./user";
import { TransformWrapper } from "react-zoom-pan-pinch";
import type { EntityPositionData } from "./types";
import { handleRollResponse } from './handlers/rollResponse';
import { handleUpdateClientGameTableEntityPosition } from "./handlers/updateClientGameTableEntityPosition";
import { handleClientGameTableEntitySync } from "./handlers/clientGameTableEntitySync";
import { UpdateGameTableEntityDetails } from "./messaging/message";
import { handleUpdateClientGameTableEntityDetails } from "./handlers/updateClientGameTableEntityDetails";
import { Item, Menu, Separator, Submenu, useContextMenu, type TriggerEvent } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import Drawer from "./components/drawer/Drawer";
import { Hero } from "./litm/hero";
import { Tag } from "./litm/tag"
import { HeroTheme } from "./litm/theme";
import { handleClientDrawerEntitySync } from "./handlers/clientDrawerEntitySync";

export const UserContext: Context<User | null> = createContext(null as User | null);

export function App() {
  const [user, setUser] = useState<User>({ username: "Fetiddius", role: "narrator" } as User)

  // STATE - this will probably need to become context provided soon, this feels like a lot...
  const [gameTableEntities, setGameTableEntities] = useState<EntityPositionData[]>([]);
  const [drawerEntities, setDrawerEntities] = useState<Entity[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [rollMessages, setRollMessages] = useState<{ id: string; text: string }[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // WEBSOCKET HANDLING
  useEffect(() => {
    // const webSocket = new WebSocket("https://litm-vtt.fly.dev/");
    const webSocket = new WebSocket("http://localhost:3000/");
    setWs(webSocket);
    webSocket.onmessage = function (event) {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'updateGameTableEntityPosition': { handleUpdateClientGameTableEntityPosition(message, setGameTableEntities); break; }
        case 'updateGameTableEntityDetails': { handleUpdateClientGameTableEntityDetails(message, setGameTableEntities); break; }
        case 'gameTableEntitySync': { handleClientGameTableEntitySync(message, setGameTableEntities); break; }
        case 'drawerEntitySync': { handleClientDrawerEntitySync(message, setDrawerEntities); break; }
        case 'rollResponse': { handleRollResponse(message, setRollMessages); break; }
        default: { console.warn(`Unknown message type: ${message.type}`); }
      }
    };
    return () => {
      webSocket.close();
    };
  }, []);

  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "start",
    height: "98vh",
    flexGrow: 1,
    margin: "5px"
  };


  const MENU_ID = "menu-id";
  const { show } = useContextMenu({ id: MENU_ID });
  function displayContextMenu(e: TriggerEvent) {
    show({
      event: e,
      id: MENU_ID
    });
  }

  function addModifier(entity: ModifierEntity, polarity: 'add' | 'subtract', isBurned: boolean) {
    setSelectedModifiers(prev => (!prev.find(e => e.entity.id === entity.id)) ? [...prev, { entity, isBurned, polarity }] : prev);
  }

  if (user) {
    return (
      <div className="app" style={style} onContextMenu={displayContextMenu}>

        <UserContext value={user}>
          <div style={{ display: "flex", gap: "4px", flexDirection: "column" }}>
            <TransformWrapper
              panning={{
                excluded: ["draggable-entity"],
                allowLeftClickPan: false,
                allowRightClickPan: false,
                velocityDisabled: true
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
            <TransformWrapper
              panning={{
                excluded: ["draggable-entity"],
                allowLeftClickPan: false,
                allowRightClickPan: false,
                velocityDisabled: true
              }}
              minScale={1}
              maxScale={1}
              centerZoomedOut={true}
              disablePadding={true}
            ><Drawer
                websocket={ws}
                entities={drawerEntities}
                viewing={"hero"}
                addModifier={addModifier} />
            </TransformWrapper>
          </div>
          <RollWidget
            websocket={ws}
            rollMessages={rollMessages}
            modifiers={selectedModifiers}
            handleRemoveModifier={(id: string) => setSelectedModifiers(prev => prev.filter(e => e.entity.id !== id))}
            clearModifiers={() => setSelectedModifiers([])}
          />
        </UserContext>

        <Menu id={MENU_ID}>
          <Item disabled>Top level</Item>
        </Menu>
      </div>
    )
  } else return (
    <div>LOGIN</div>
  );
}

export default App;
