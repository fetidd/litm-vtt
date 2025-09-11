import { GameTable } from "./components/game_table/GameTable";
import "../assets/index.css";
import { UpdateGameTableEntityPosition } from "./messaging/message";
import Entity from "./litm/entity";
import { useEffect, useState } from "react";
import RollWidget from "./components/roll_widget/RollWidget";

type EntityPositionData = { entity: Entity, position: { x: number, y: number } };

export function App() {
  // console.debug("Rendering App component");
  const [gameTableEntities, setGameTableEntities] = useState<EntityPositionData[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);
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
        default:
          console.warn(`Unknown message type: ${message.type}`);
      }
    };

    return () => {
      webSocket.close();
    };
  }, []);

  const sendEntityPosition = (id: string, x: number, y: number) => {
    const message = new UpdateGameTableEntityPosition(id, x, y);
    // console.debug("Sending message:", message);
    ws!.send(JSON.stringify(message));
  }

  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "start",
    height: "100vh",
    flexGrow: 1,
    };

  return (
    <div className="app" style={style}>
      <GameTable 
        entities={gameTableEntities} 
        sendEntityPosition={sendEntityPosition}
        toggleSelectedEntity={(entity: Entity) => {
          console.debug("Toggling selected entity:", entity);
          setSelectedEntities(prev => {
            if (!prev.find(e => e.id === entity.id)) {
              return [...prev, entity];
            }
            return prev.filter(e => e.id !== entity.id);
          });
        }}
      />
      <RollWidget entities={selectedEntities} handleRemoveModifier={(id: string) => {
        console.debug("Removing modifier:", id);
        setSelectedEntities(prev => prev.filter(e => e.id !== id));
      }}/>
    </div>
  );
}

export default App;
