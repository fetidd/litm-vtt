import "../assets/index.css";

import { GameTable } from "./components/game_table/GameTable";
import { RollResponse, UpdateGameTableEntityPosition } from "./messaging/message";
import { Entity, ModifierEntity } from "./litm/entity";
import { createContext, useEffect, useState, type Context } from "react";
import RollWidget from "./components/roll_widget/RollWidget";

import type Modifier from "./litm/modifier";
import type User from "./user";
import { TransformWrapper } from "react-zoom-pan-pinch";

type EntityPositionData = { entity: Entity, position: { x: number, y: number } };

export const UserContext: Context<User | null> = createContext(null as User | null);

export function App() {
  const [user, setUser] = useState<User>({ username: "Fetiddius", role: "narrator" } as User)

  // STATE - this will probably need to become context provided soon, this feels like a lot...
  const [gameTableEntities, setGameTableEntities] = useState<EntityPositionData[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [rollMessages, setRollMessages] = useState<{ id: string; text: string }[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:3000/");
    setWs(webSocket);

    webSocket.onmessage = function (event) {
      const message = JSON.parse(event.data);
      switch (message.type) {

        case 'updateGameTableEntityPosition':
          const { id, x, y }: UpdateGameTableEntityPosition = message;
          setGameTableEntities(prev => prev.map(e => e.entity.id === id ? { ...e, position: { x, y } } : e));
          break;

        case 'gameTableEntitySync':
          const { entities }: { entities: EntityPositionData[] } = message; // TODO create an actual message for this!
          entities.forEach((e: EntityPositionData) => {
            const existingEntity = gameTableEntities.find(ent => ent.entity.id === e.entity.id);
            if (existingEntity) {
              existingEntity.position.x = e.position.x;
              existingEntity.position.y = e.position.y;
            } else {
              setGameTableEntities(prev => {
                return [...prev, { position: { x: e.position.x, y: e.position.y }, entity: e.entity }];
              });
            }
          });
          break;

        case 'rollResponse':
          const rollMessage = message as RollResponse;
          setRollMessages(prev => [...prev, { id: rollMessage.id, text: rollMessage.message }])
          break;

        default:
          console.warn(`Unknown message type: ${message.type}`);
      }
    };

    return () => {
      webSocket.close();
    };
  }, []);

  const toggleSelectedModifier = (entity: ModifierEntity, polarity: 'add' | 'subtract', isBurned: boolean) => {
    setSelectedModifiers(prev => {
      if (!prev.find(e => e.entity.id === entity.id)) {
        return [...prev, { entity, isBurned, polarity }];
      }
      return prev;
    });
  };

  const removeEntityFromGameTable = (entity: Entity) => {
    setGameTableEntities(prev => {
      return [...prev.filter(e => e.entity.id != entity.id)];
    })
  };

  const handleRemoveModifier = (id: string) => {
    setSelectedModifiers(prev => prev.filter(e => e.entity.id !== id));
  };

  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "start",
    height: "98vh",
    flexGrow: 1,
    margin: "5px"
  };

  return (
    <div className="app" style={style}>
      <UserContext value={user}>
        <TransformWrapper
          panning={{ excluded: ["draggable-entity"] }}
          minScale={0.5}
          maxScale={1}
          // limitToBounds={false}
          centerZoomedOut={true}
          disablePadding={true}
          minPositionX={0}
          minPositionY={0}
          maxPositionX={0}
          maxPositionY={0}
        >
          <GameTable
            websocket={ws}
            entities={gameTableEntities}
            addModifier={toggleSelectedModifier}
            removeEntity={removeEntityFromGameTable}
          />
        </TransformWrapper>
        <RollWidget
          websocket={ws}
          rollMessages={rollMessages}
          modifiers={selectedModifiers}
          handleRemoveModifier={handleRemoveModifier}
          clearModifiers={() => setSelectedModifiers([])}
        />
      </UserContext>
    </div>
  );
}

export default App;
