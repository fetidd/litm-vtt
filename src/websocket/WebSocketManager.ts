import type { Entity, EntityType } from "@/litm/entity";
import type { Hero } from "@/litm/hero";
import type { Challenge } from "@/litm/challenge";
import type { EntityPositionData } from "@/types";
import type User from "@/user";

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface WebSocketManagerOptions {
  url: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private messageHandlers = new Map<string, (message: any) => void>();
  private options: WebSocketManagerOptions;

  constructor(options: WebSocketManagerOptions) {
    this.options = options;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.options.url);
      
      this.ws.onopen = () => {
        this.options.onOpen?.();
        resolve();
      };
      
      this.ws.onclose = () => {
        this.options.onClose?.();
      };
      
      this.ws.onerror = (error) => {
        this.options.onError?.(error);
        reject(error);
      };
      
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const handler = this.messageHandlers.get(message.type);
        if (handler) {
          handler(message);
        } else {
          this.options.onMessage?.(message);
        }
      };
    });
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private send(message: WebSocketMessage): void {
    if (this.isConnected()) {
      this.ws!.send(JSON.stringify(message));
    }
  }

  onMessage(type: string, handler: (message: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  // Client methods
  updateGameTableEntityPosition(id: string, x: number, y: number): void {
    this.send({ type: "updateGameTableEntityPosition", id, x, y });
  }

  updateGameTableEntityDetails(entity: Entity): void {
    this.send({ type: "updateGameTableEntityDetails", entity: entity.serialize() });
  }

  createNewGameTableEntity(entity: Entity, x: number, y: number): void {
    this.send({ type: "createNewGameTableEntity", entity: entity.serialize(), x, y });
  }

  deleteGameTableEntity(id: string, entityType: EntityType): void {
    this.send({ type: "deleteGameTableEntity", id, entityType });
  }

  rollRequest(message: string): void {
    this.send({ type: "rollRequest", message });
  }

  joinSession(sessionId: string, user: User): void {
    this.send({ type: "joinSession", sessionId, user });
  }

  updateDrawerEntity(entity: Entity, sessionId: string): void {
    this.send({ type: "updateDrawerEntity", entity: entity.serialize(), sessionId });
  }

  createDrawerEntity(entity: Entity, sessionId: string): void {
    this.send({ type: "createDrawerEntity", entity: entity.serialize(), sessionId });
  }
}

export class WebSocketServer {
  private messageHandlers = new Map<string, (ws: any, message: any, ...args: any[]) => void>();

  onMessage(type: string, handler: (ws: any, message: any, ...args: any[]) => void): void {
    this.messageHandlers.set(type, handler);
  }

  handleMessage(ws: any, message: string | Buffer, ...args: any[]): void {
    const parsedMessage = JSON.parse(message.toString());
    const handler = this.messageHandlers.get(parsedMessage.type);
    if (handler) {
      handler(ws, parsedMessage, ...args);
    } else {
      console.warn(`Unknown message type: ${parsedMessage.type}`);
    }
  }

  // Server methods
  gameTableEntitySync(ws: any, entities: EntityPositionData[]): void {
    const message = {
      type: "gameTableEntitySync",
      entities: entities.map((data) => ({ ...data, entity: data.entity.serialize() }))
    };
    ws.send(JSON.stringify(message));
  }

  drawerEntitySync(ws: any, entities: (Hero | Challenge)[]): void {
    const message = {
      type: "drawerEntitySync",
      entities: entities.map((entity) => (entity as any).serialize())
    };
    ws.send(JSON.stringify(message));
  }

  updateGameTableEntityPosition(server: any, id: string, x: number, y: number): void {
    const message = { type: "updateGameTableEntityPosition", id, x, y };
    server.publish("game-table", JSON.stringify(message));
  }

  updateGameTableEntityDetails(server: any, entity: Entity): void {
    const message = { type: "updateGameTableEntityDetails", entity: entity.serialize() };
    server.publish("game-table", JSON.stringify(message));
  }

  rollResponse(server: any, id: string, message: string): void {
    const response = { type: "rollResponse", id, message };
    server.publish("rolls", JSON.stringify(response));
  }

  backgroundImage(server: any, imageUrl: string): void {
    const message = { type: "backgroundImage", imageUrl };
    server.publish("game-table", JSON.stringify(message));
  }

  connectedUsers(server: any, users: User[]): void {
    const message = { type: "connectedUsers", users };
    server.publish("game-table", JSON.stringify(message));
  }
}