import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import { WebSocketManager, WebSocketServer } from "@/websocket/WebSocketManager";
import { Tag } from "@/litm/tag";
import User from "@/user";

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(public url: string) {}

  send(data: string): void {
    // Mock implementation
  }

  close(): void {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new CloseEvent("close"));
  }

  simulateOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.(new Event("open"));
  }

  simulateMessage(data: any): void {
    this.onmessage?.(new MessageEvent("message", { data: JSON.stringify(data) }));
  }

  simulateError(): void {
    const error = new Event("error");
    this.onerror?.(error);
  }
}

// Replace global WebSocket with mock
(global as any).WebSocket = MockWebSocket;

describe("WebSocketManager", () => {
  let manager: WebSocketManager;
  let mockWs: MockWebSocket;
  let onOpenSpy = mock();
  let onCloseSpy = mock();
  let onErrorSpy = mock();
  let onMessageSpy = mock();

  beforeEach(() => {
    onOpenSpy.mockClear();
    onCloseSpy.mockClear();
    onErrorSpy.mockClear();
    onMessageSpy.mockClear();

    manager = new WebSocketManager({
      url: "ws://localhost:3000",
      onOpen: onOpenSpy,
      onClose: onCloseSpy,
      onError: onErrorSpy,
      onMessage: onMessageSpy,
    });
  });

  afterEach(() => {
    manager.disconnect();
  });

  describe("connection management", () => {
    it("should connect successfully", async () => {
      const connectPromise = manager.connect();
      
      // Simulate WebSocket opening
      setTimeout(() => {
        const ws = (manager as any).ws as MockWebSocket;
        ws.simulateOpen();
      }, 0);

      await connectPromise;
      expect(onOpenSpy).toHaveBeenCalled();
      expect(manager.isConnected()).toBe(true);
    });

    it("should handle connection errors", async () => {
      const connectPromise = manager.connect();
      
      setTimeout(() => {
        const ws = (manager as any).ws as MockWebSocket;
        ws.simulateError();
      }, 0);

      await expect(connectPromise).rejects.toThrow();
      expect(onErrorSpy).toHaveBeenCalled();
    });

    it("should disconnect properly", async () => {
      const connectPromise = manager.connect();
      setTimeout(() => {
        const ws = (manager as any).ws as MockWebSocket;
        ws.simulateOpen();
      }, 0);
      await connectPromise;

      manager.disconnect();
      expect(manager.isConnected()).toBe(false);
    });
  });

  describe("message handling", () => {
    beforeEach(async () => {
      const connectPromise = manager.connect();
      setTimeout(() => {
        const ws = (manager as any).ws as MockWebSocket;
        ws.simulateOpen();
      }, 0);
      await connectPromise;
    });

    it("should handle registered message types", () => {
      const handler = mock();
      manager.onMessage("testType", handler);

      const ws = (manager as any).ws as MockWebSocket;
      ws.simulateMessage({ type: "testType", data: "test" });

      expect(handler).toHaveBeenCalledWith({ type: "testType", data: "test" });
    });

    it("should call default handler for unregistered message types", () => {
      const ws = (manager as any).ws as MockWebSocket;
      ws.simulateMessage({ type: "unknownType", data: "test" });

      expect(onMessageSpy).toHaveBeenCalledWith({ type: "unknownType", data: "test" });
    });
  });

  describe("client methods", () => {
    let sendSpy: any;

    beforeEach(async () => {
      const connectPromise = manager.connect();
      setTimeout(() => {
        const ws = (manager as any).ws as MockWebSocket;
        ws.simulateOpen();
      }, 0);
      await connectPromise;

      sendSpy = mock();
      (manager as any).ws.send = sendSpy;
    });

    it("should send updateGameTableEntityPosition message", () => {
      manager.updateGameTableEntityPosition("id1", 10, 20);
      
      expect(sendSpy).toHaveBeenCalledWith(
        JSON.stringify({ type: "updateGameTableEntityPosition", id: "id1", x: 10, y: 20 })
      );
    });

    it("should send updateGameTableEntityDetails message", () => {
      const tag = Tag.deserialize({ id: "tag1", name: "test", isScratched: false, owner: "user1" });
      manager.updateGameTableEntityDetails(tag);
      
      expect(sendSpy).toHaveBeenCalledWith(
        JSON.stringify({ type: "updateGameTableEntityDetails", entity: tag.serialize() })
      );
    });

    it("should send createNewGameTableEntity message", () => {
      const tag = Tag.deserialize({ id: "tag1", name: "test", isScratched: false, owner: "user1" });
      manager.createNewGameTableEntity(tag, 5, 15);
      
      expect(sendSpy).toHaveBeenCalledWith(
        JSON.stringify({ type: "createNewGameTableEntity", entity: tag.serialize(), x: 5, y: 15 })
      );
    });

    it("should send deleteGameTableEntity message", () => {
      manager.deleteGameTableEntity("id1", "tag");
      
      expect(sendSpy).toHaveBeenCalledWith(
        JSON.stringify({ type: "deleteGameTableEntity", id: "id1", entityType: "tag" })
      );
    });

    it("should send rollRequest message", () => {
      manager.rollRequest("test roll");
      
      expect(sendSpy).toHaveBeenCalledWith(
        JSON.stringify({ type: "rollRequest", message: "test roll" })
      );
    });

    it("should send joinSession message", () => {
      const user = User.deserialize({ username: "testuser", role: "player" });
      manager.joinSession("session1", user);
      
      expect(sendSpy).toHaveBeenCalledWith(
        JSON.stringify({ type: "joinSession", sessionId: "session1", user })
      );
    });

    it("should not send messages when disconnected", () => {
      manager.disconnect();
      manager.rollRequest("test");
      
      expect(sendSpy).not.toHaveBeenCalled();
    });
  });
});

describe("WebSocketServer", () => {
  let server: WebSocketServer;
  let mockWs: any;
  let mockServer: any;

  beforeEach(() => {
    server = new WebSocketServer();
    mockWs = {
      send: mock(),
    };
    mockServer = {
      publish: mock(),
    };
  });

  describe("message handling", () => {
    it("should handle registered message types", () => {
      const handler = mock();
      server.onMessage("testType", handler);

      server.handleMessage(mockWs, JSON.stringify({ type: "testType", data: "test" }));

      expect(handler).toHaveBeenCalledWith(mockWs, { type: "testType", data: "test" });
    });

    it("should log warning for unknown message types", () => {
      const consoleSpy = mock();
      console.warn = consoleSpy;

      server.handleMessage(mockWs, JSON.stringify({ type: "unknownType" }));

      expect(consoleSpy).toHaveBeenCalledWith("Unknown message type: unknownType");
    });
  });

  describe("server methods", () => {
    it("should send gameTableEntitySync message", () => {
      const tag = Tag.deserialize({ id: "tag1", name: "test", isScratched: false, owner: "user1" });
      const entities = [{ entity: tag, position: { x: 10, y: 20 } }];

      server.gameTableEntitySync(mockWs, entities);

      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: "gameTableEntitySync",
          entities: [{ entity: tag.serialize(), position: { x: 10, y: 20 } }]
        })
      );
    });

    it("should publish updateGameTableEntityPosition message", () => {
      server.updateGameTableEntityPosition(mockServer, "id1", 10, 20);

      expect(mockServer.publish).toHaveBeenCalledWith(
        "game-table",
        JSON.stringify({ type: "updateGameTableEntityPosition", id: "id1", x: 10, y: 20 })
      );
    });

    it("should publish rollResponse message", () => {
      server.rollResponse(mockServer, "roll1", "test message");

      expect(mockServer.publish).toHaveBeenCalledWith(
        "rolls",
        JSON.stringify({ type: "rollResponse", id: "roll1", message: "test message" })
      );
    });
  });
});