import { describe, it, expect, mock, beforeEach } from "bun:test";
import { handleNewWebSocketConnection } from "@/server/handlers/newWebSocketConnection";
import { Tag } from "@/litm/tag";
import { Hero } from "@/litm/hero";

describe("handleNewWebSocketConnection", () => {
  let mockWs: any;
  let mockDb: any;

  beforeEach(() => {
    mockWs = {
      remoteAddress: "127.0.0.1",
      subscribe: mock(() => {}),
      send: mock(() => {})
    };

    mockDb = {
      getAllEntitiesWithPositions: mock(() => [
        {
          entity: Tag.deserialize({
            id: "tag1",
            name: "test tag",
            isScratched: false,
            owner: "user1"
          }),
          position: { x: 10, y: 20 }
        }
      ]),
      getAllDrawerEntities: mock(() => [
        Hero.deserialize({
          id: "hero1",
          name: "Test Hero",
          promise: 2,
          description: "",
          themes: [],
          backpack: [],
          relationships: [],
          fellowship: undefined,
          owner: "user1"
        })
      ])
    };
  });

  it("should subscribe to channels and send sync messages", () => {
    handleNewWebSocketConnection(mockWs, mockDb);

    expect(mockWs.subscribe).toHaveBeenCalledTimes(3);
    expect(mockWs.subscribe).toHaveBeenCalledWith("game-table");
    expect(mockWs.subscribe).toHaveBeenCalledWith("rolls");
    expect(mockWs.subscribe).toHaveBeenCalledWith("drawer");

    expect(mockWs.send).toHaveBeenCalledTimes(2);
    expect(mockDb.getAllEntitiesWithPositions).toHaveBeenCalledTimes(1);
    expect(mockDb.getAllDrawerEntities).toHaveBeenCalledTimes(1);
  });

  it("should send game table entity sync message", () => {
    handleNewWebSocketConnection(mockWs, mockDb);

    const firstSendCall = mockWs.send.mock.calls[0];
    const gameTableMessage = JSON.parse(firstSendCall[0]);
    
    expect(gameTableMessage.type).toBe("gameTableEntitySync");
    expect(gameTableMessage.entities).toHaveLength(1);
    expect(gameTableMessage.entities[0].entity).toEqual({
      id: "tag1",
      name: "test tag",
      isScratched: false,
      owner: "user1",
      entityType: "tag"
    });
    expect(gameTableMessage.entities[0].position).toEqual({ x: 10, y: 20 });
  });

  it("should send drawer entity sync message", () => {
    handleNewWebSocketConnection(mockWs, mockDb);

    const secondSendCall = mockWs.send.mock.calls[1];
    const drawerMessage = JSON.parse(secondSendCall[0]);
    
    expect(drawerMessage.type).toBe("drawerEntitySync");
    expect(drawerMessage.entities).toHaveLength(1);
    expect(drawerMessage.entities[0]).toEqual({
      id: "hero1",
      name: "Test Hero",
      promise: 2,
      description: "",
      themes: [],
      backpack: [],
      relationships: [],
      fellowship: undefined,
      owner: "user1",
      entityType: "hero"
    });
  });

  it("should handle empty entities", () => {
    mockDb.getAllEntitiesWithPositions.mockReturnValue([]);
    mockDb.getAllDrawerEntities.mockReturnValue([]);

    handleNewWebSocketConnection(mockWs, mockDb);

    const gameTableMessage = JSON.parse(mockWs.send.mock.calls[0][0]);
    const drawerMessage = JSON.parse(mockWs.send.mock.calls[1][0]);
    
    expect(gameTableMessage.entities).toHaveLength(0);
    expect(drawerMessage.entities).toHaveLength(0);
  });

  it("should log connection info", () => {
    const consoleSpy = mock(() => {});
    const originalDebug = console.debug;
    console.debug = consoleSpy;

    handleNewWebSocketConnection(mockWs, mockDb);

    expect(consoleSpy).toHaveBeenCalledWith("WebSocket connection opened: 127.0.0.1");
    
    console.debug = originalDebug;
  });
});