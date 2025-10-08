import "../assets/index.css";
import "../assets/spinner.css";

import { GameTable } from "./components/game_table/GameTable";
import { Entity, ModifierEntity } from "./litm/entity";
import { createContext, useEffect, useState, type Context } from "react";
import RollWidget from "./components/roll_widget/RollWidget";
import type Modifier from "./litm/modifier";
import User from "./user";
import { TransformWrapper } from "react-zoom-pan-pinch";
import type { EntityPositionData } from "./types";
import { handleRollResponse } from "./handlers/rollResponse";
import { handleUpdateClientGameTableEntityPosition } from "./handlers/updateClientGameTableEntityPosition";
import { handleClientGameTableEntitySync } from "./handlers/clientGameTableEntitySync";
import { handleUpdateClientGameTableEntityDetails } from "./handlers/updateClientGameTableEntityDetails";
import { Item, Menu, useContextMenu, type TriggerEvent } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import Drawer from "./components/drawer/Drawer";
import { handleClientDrawerEntitySync } from "./handlers/clientDrawerEntitySync";
import { WebSocketManager } from "./websocket/WebSocketManager";
import ResizeHandle from "./components/ui/ResizeHandle";
import CircularResizeHandle from "./components/ui/CircularResizeHandle";
import WebsocketStatus from "./components/menu_bar/WebsocketStatus";
import ConnectedUsersList from "./components/menu_bar/ConnectedUsersList";
import WelcomeMessage from "./components/menu_bar/WelcomeMessage";
import Button from "./components/ui/Button";
import LoginScreen from "./components/forms/LoginScreen";
import Modal from "./components/ui/Modal";
import CreateHeroForm from "./components/forms/CreateHeroForm";
import { Hero as LitmHero } from "./litm/hero";
import { deleteCookie, getCookie, setCookie } from "./cookie";

export const UserContext: Context<User | null> = createContext(
  null as User | null,
);

export const SessionContext: Context<string | null> = createContext(
  null as string | null,
);

export function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = getCookie("userData");
    if (saved) {
      const data = JSON.parse(saved);
      return User.deserialize({ username: data.username, role: data.role });
    }
    return null;
  });
  const [session, setSession] = useState<string | null>(() => {
    const saved = getCookie("userData");
    return saved ? JSON.parse(saved).session : null;
  });

  // STATE - this will probably need to become context provided soon, this feels like a lot...
  const [gameTableEntities, setGameTableEntities] = useState<
    EntityPositionData[]
  >([]);
  const [drawerEntities, setDrawerEntities] = useState<Entity[]>([]);
  const [drawerLoaded, setDrawerLoaded] = useState(false);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [rollMessages, setRollMessages] = useState<
    { id: string; text: string }[]
  >([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [showCreateHeroModal, setShowCreateHeroModal] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState(() => {
    const saved = localStorage.getItem("drawerHeight");
    return saved ? parseInt(saved) : 200;
  });
  const [rollWidgetWidth, setRollWidgetWidth] = useState(() => {
    const saved = localStorage.getItem("rollWidgetWidth");
    return saved ? parseInt(saved) : 300;
  });

  // WEBSOCKET HANDLING - only when user is logged in
  useEffect(() => {
    if (!user || !session) {
      setWsManager(null);
      setWsConnected(false);
      setDrawerLoaded(false);
      return;
    }

    const manager = new WebSocketManager({
      url: "ws://localhost:3000/",
      onOpen: () => {
        setWsConnected(true);
        manager.joinSession(session, user);
      },
      onClose: () => setWsConnected(false),
      onError: () => setWsConnected(false),
    });

    // Register message handlers
    manager.onMessage("updateGameTableEntityPosition", (message) => {
      handleUpdateClientGameTableEntityPosition(message, setGameTableEntities);
    });
    manager.onMessage("updateGameTableEntityDetails", (message) => {
      handleUpdateClientGameTableEntityDetails(message, setGameTableEntities);
    });
    manager.onMessage("gameTableEntitySync", (message) => {
      handleClientGameTableEntitySync(message, setGameTableEntities);
    });
    manager.onMessage("drawerEntitySync", (message) => {
      handleClientDrawerEntitySync(message, setDrawerEntities);
      setDrawerLoaded(true);
      if (user?.role === "player") {
        const hasHero = message.entities.some(
          (entity: any) =>
            entity.entityType === "hero" && entity.owner === user.username,
        );
        if (!hasHero) {
          setShowCreateHeroModal(true);
        }
      }
    });
    manager.onMessage("rollResponse", (message) => {
      handleRollResponse(message, setRollMessages);
    });
    manager.onMessage("backgroundImage", (message) => {
      setBackgroundImage(message.imageUrl);
    });
    manager.onMessage("connectedUsers", (message) => {
      setConnectedUsers(message.users);
    });

    manager.connect().catch(console.error);
    setWsManager(manager);

    return () => {
      manager.disconnect();
    };
  }, [session, user]);

  const style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `1fr 8px ${rollWidgetWidth}px`,
    gridTemplateRows: `40px 1fr 8px ${drawerHeight}px`,
    gridTemplateAreas: `
      "menu-bar menu-bar menu-bar"
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
      const newHeight = Math.max(
        100,
        Math.min(maxHeight, startHeight + deltaY),
      );
      setDrawerHeight(newHeight);
      localStorage.setItem("drawerHeight", newHeight.toString());
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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
      localStorage.setItem("rollWidgetWidth", newWidth.toString());
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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
      const newHeight = Math.max(
        100,
        Math.min(maxHeight, startHeight + deltaY),
      );
      setRollWidgetWidth(newWidth);
      setDrawerHeight(newHeight);
      localStorage.setItem("rollWidgetWidth", newWidth.toString());
      localStorage.setItem("drawerHeight", newHeight.toString());
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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

  function handleUpdateEntity(updatedEntity: Entity) {
    setDrawerEntities((prev) =>
      prev.map((entity) =>
        entity.id === updatedEntity.id ? updatedEntity : entity,
      ),
    );
    // Send update to server if websocket is available
    if (wsManager) {
      wsManager.updateDrawerEntity(updatedEntity, session!);
    }
  }

  function handleCreateHero(hero: LitmHero) {
    setDrawerEntities((prev) => [...prev, hero]);
    setShowCreateHeroModal(false);
    // Send new hero to server
    if (wsManager) {
      wsManager.createDrawerEntity(hero, session!);
    }
  }

  const handleLogin = (user: User, sessionCode: string) => {
    setUser(user);
    setSession(sessionCode);
    setCookie("userData", JSON.stringify({ ...user, session: sessionCode }));
  };

  const handleLogout = () => {
    setUser(null);
    setSession(null);
    deleteCookie("userData");
  };

  if (user) {
    return (
      <div
        className="app"
        style={{ ...style, position: "relative" }}
        onContextMenu={displayContextMenu}
      >
        <UserContext value={user}>
          <SessionContext value={session}>
            <div
              style={{
                gridArea: "menu-bar",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 8px",
                background: "#333",
                color: "white",
              }}
            >
              <WelcomeMessage username={user.username} />
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                {wsConnected && <ConnectedUsersList users={connectedUsers} />}
                <WebsocketStatus
                  connected={wsConnected}
                  sessionCode={session}
                />
                <Button onClick={handleLogout} variant="header">
                  Logout
                </Button>
              </div>
            </div>
            <div
              style={{
                gridArea: "game-table",
                overflow: "hidden",
                height: "100%",
              }}
            >
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
                  websocket={wsManager}
                  gameTableEntities={gameTableEntities}
                  setGameTableEntities={setGameTableEntities}
                  backgroundImage={backgroundImage}
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
            <div
              style={{ gridArea: "drawer", overflow: "hidden", height: "100%" }}
            >
              <Drawer
                websocket={wsManager}
                entities={
                  user?.role === "narrator"
                    ? drawerEntities
                    : drawerEntities.filter(
                        (entity) => entity.owner === user?.username,
                      )
                }
                viewing={"hero"}
                addModifier={addModifier}
                onUpdateEntity={handleUpdateEntity}
                onCreateHero={() => setShowCreateHeroModal(true)}
                loading={!drawerLoaded}
              />
            </div>
            <div style={{ gridArea: "roll-widget" }}>
              <RollWidget
                websocket={wsManager}
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
          </SessionContext>
        </UserContext>

        <Menu id={MENU_ID}>
          <Item disabled>Top level</Item>
        </Menu>

        <Modal
          isOpen={showCreateHeroModal}
          onClose={() => setShowCreateHeroModal(false)}
          title="Create Your Hero"
        >
          <CreateHeroForm
            onCreateHero={handleCreateHero}
            onCancel={() => setShowCreateHeroModal(false)}
            username={user.username}
          />
        </Modal>
      </div>
    );
  }

  return <LoginScreen onLogin={handleLogin} />;
}

export default App;
