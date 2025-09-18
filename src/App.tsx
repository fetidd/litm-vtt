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


export const UserContext: Context<User | null> = createContext(null as User | null);

export function App() {
  const [user, setUser] = useState<User>({ username: "Fetiddius", role: "narrator" } as User)

  // STATE - this will probably need to become context provided soon, this feels like a lot...
  const [gameTableEntities, setGameTableEntities] = useState<EntityPositionData[]>([]);
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
        case 'updateGameTableEntityPosition': {handleUpdateClientGameTableEntityPosition(message, setGameTableEntities); break;}
        case 'updateGameTableEntityDetails':  {handleUpdateClientGameTableEntityDetails(message, setGameTableEntities); break;}
        case 'gameTableEntitySync':           {handleClientGameTableEntitySync(message, setGameTableEntities); break;}
        case 'rollResponse':                  {handleRollResponse(message, setRollMessages); break;}
        default:                              {console.warn(`Unknown message type: ${message.type}`);}
      }
    };
    return () => {
      webSocket.close();
    };
  }, []);

  const addSelectedModifier = (entity: ModifierEntity, polarity: 'add' | 'subtract', isBurned: boolean) => {
    setSelectedModifiers(prev => {
      if (!prev.find(e => e.entity.id === entity.id)) {
        return [...prev, { entity, isBurned, polarity }];
      }
      return prev;
    });
  };

  const addNewEntityToGameTable = (entity: Entity, position: { x: number, y: number }) => {
    setGameTableEntities(prev => [...prev, { entity: entity, position: position }])
  }

  const removeEntityFromGameTable = (entity: Entity) => {
    setGameTableEntities(prev => [...prev.filter(e => e.entity.id != entity.id)])
  };

  const updateEntityDetails = (id: string, updater: (ent: Entity) => Entity) => {
    const entityToUpdate = gameTableEntities.find(e => e.entity.id == id);
    if (entityToUpdate) {
      const updated = updater(entityToUpdate.entity);
      setGameTableEntities(prev => {
        return [...prev.filter(e => e.entity.id != id), { ...entityToUpdate, entity: updated }]
      })
      if (ws == undefined || ws == null) throw Error("Editing without an open websocket!");
      ws.send(JSON.stringify(new UpdateGameTableEntityDetails(updated.serialize())))
    } else throw Error("How can we have edited an entity that doesnt exist?!");
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

  if (user) {
    return (
      <div className="app" style={style}>
        <UserContext value={user}>
          <TransformWrapper
            panning={{ excluded: ["draggable-entity"] }}
            minScale={1}
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
              addModifier={addSelectedModifier}
              removeEntity={removeEntityFromGameTable}
              addEntity={addNewEntityToGameTable}
              updateEntity={updateEntityDetails}
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
    )
  } else return (
    <div>LOGIN</div>
  );
}

export default App;
