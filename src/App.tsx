import { GameTable } from "./components/game_table/GameTable";
import "../assets/index.css";
import { RollRequest, RollResponse, UpdateGameTableEntityPosition } from "./messaging/message";
import { Entity, ModifierEntity } from "./litm/entity";
import { useEffect, useState } from "react";
import RollWidget from "./components/roll_widget/RollWidget";
import type Modifier from "./litm/modifier";

type EntityPositionData = { entity: Entity, position: { x: number, y: number } };

export function App() {
  // console.debug("Rendering App component");
  const [gameTableEntities, setGameTableEntities] = useState<EntityPositionData[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [rollMessages, setRollMessages] = useState<{ id: string; text: string }[]>([]);

  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:3000/");
    setWs(webSocket);

    webSocket.onmessage = function (event) {
      // console.debug(`Received message: ${event.data}`);
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'updateGameTableEntityPosition':
          const { id, x, y }: UpdateGameTableEntityPosition = message;
          // console.debug(`Updating position of entity ${id} to (${x}, ${y})`);
          setGameTableEntities(prev => prev.map(e => e.entity.id === id ? { ...e, position: { x, y } } : e));
          break;
        case 'gameTableEntitySync':
          const { entities }: { entities: EntityPositionData[] } = message;
          entities.forEach((e: EntityPositionData) => {
            const existingEntity = gameTableEntities.find(ent => ent.entity.id === e.entity.id);
            if (existingEntity) {
              existingEntity.position.x = e.position.x;
              existingEntity.position.y = e.position.y;
            } else {
              // console.debug("Adding entity from sync:", e);
              setGameTableEntities(prev => {
                return [...prev, { position: { x: e.position.x, y: e.position.y }, entity: e.entity }];
              });
            }
          });
          break;
        case 'rollResponse':
          const rollMessage = message as RollResponse;
          setRollMessages(prev => [...prev, {id: rollMessage.id, text: rollMessage.message}])
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
    // console.debug("Toggling selected modifier:", entity);
    setSelectedModifiers(prev => {
      if (!prev.find(e => e.entity.id === entity.id)) {
        return [...prev, { entity, isBurned, polarity }];
      }
      return prev;
    });
  };

  const removeEntityFromGameTable = (entity: Entity) => {
    setGameTableEntities(prev => {
      return [ ...prev.filter(e => e.entity.id != entity.id)];
    })
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
      <GameTable
        websocket={ws}
        entities={gameTableEntities}
        addModifier={toggleSelectedModifier}
        removeEntity={removeEntityFromGameTable}
      />
      <RollWidget 
        websocket={ws}
        rollMessages={rollMessages}
        modifiers={selectedModifiers} 
        handleRemoveModifier={(id: string) => {
          // console.debug("Removing modifier:", id);
          setSelectedModifiers(prev => prev.filter(e => e.entity.id !== id));
        }}
        clearModifiers={() => setSelectedModifiers([])}
      />
    </div>
  );
}

export default App;
