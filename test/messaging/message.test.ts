import { describe, it, expect } from "bun:test";
import {
  Message,
  ClientMessage,
  ServerMessage,
  UpdateClientGameTableEntityPosition,
  CreateNewGameTableEntity,
  UpdateClientGameTableEntityDetails,
  RollRequest,
  DeleteGameTableEntity,
  GameTableEntitySync,
  UpdateGameTableEntityPosition,
  UpdateGameTableEntityDetails,
  RollResponse,
} from "@/messaging/message";
import { Tag } from "@/litm/tag";

describe("Message", () => {
  it("should be abstract class", () => {
    expect(Message.prototype.constructor).toBe(Message);
  });
});

describe("ClientMessage", () => {
  it("should extend Message", () => {
    expect(ClientMessage.prototype).toBeInstanceOf(Message);
  });
});

describe("ServerMessage", () => {
  it("should extend Message", () => {
    expect(ServerMessage.prototype).toBeInstanceOf(Message);
  });
});

describe("UpdateClientGameTableEntityPosition", () => {
  it("should create instance with correct properties", () => {
    const message = new UpdateClientGameTableEntityPosition("id1", 10, 20);
    
    expect(message.type).toBe("updateGameTableEntityPosition");
    expect(message.id).toBe("id1");
    expect(message.x).toBe(10);
    expect(message.y).toBe(20);
    expect(message).toBeInstanceOf(ClientMessage);
  });
});

describe("CreateNewGameTableEntity", () => {
  it("should create instance with correct properties", () => {
    const entity = Tag.deserialize({
      id: "tag1",
      name: "test tag",
      isScratched: false,
      owner: "user1"
    });
    const message = new CreateNewGameTableEntity(entity, 15, 25);
    
    expect(message.type).toBe("createNewGameTableEntity");
    expect(message.entity).toBe(entity);
    expect(message.x).toBe(15);
    expect(message.y).toBe(25);
    expect(message).toBeInstanceOf(ClientMessage);
  });
});

describe("UpdateClientGameTableEntityDetails", () => {
  it("should create instance with correct properties", () => {
    const entity = Tag.deserialize({
      id: "tag1",
      name: "test tag",
      isScratched: false,
      owner: "user1"
    });
    const message = new UpdateClientGameTableEntityDetails(entity);
    
    expect(message.type).toBe("updateGameTableEntityDetails");
    expect(message.entity).toBe(entity);
    expect(message).toBeInstanceOf(ClientMessage);
  });
});

describe("RollRequest", () => {
  it("should create instance with correct properties", () => {
    const message = new RollRequest("roll 2d6");
    
    expect(message.type).toBe("rollRequest");
    expect(message.message).toBe("roll 2d6");
    expect(message).toBeInstanceOf(ClientMessage);
  });
});

describe("DeleteGameTableEntity", () => {
  it("should create instance with correct properties", () => {
    const message = new DeleteGameTableEntity("id1", "tag");
    
    expect(message.type).toBe("deleteGameTableEntity");
    expect(message.id).toBe("id1");
    expect(message.entityType).toBe("tag");
    expect(message).toBeInstanceOf(ClientMessage);
  });
});

describe("GameTableEntitySync", () => {
  it("should create instance with correct properties", () => {
    const entities = [{
      id: "id1",
      x: 10,
      y: 20,
      entity: Tag.deserialize({
        id: "tag1",
        name: "test tag",
        isScratched: false,
        owner: "user1"
      })
    }];
    const message = new GameTableEntitySync(entities);
    
    expect(message.type).toBe("gameTableEntitySync");
    expect(message.entities).toBe(entities);
    expect(message).toBeInstanceOf(ServerMessage);
  });
});

describe("UpdateGameTableEntityPosition", () => {
  it("should create instance with correct properties", () => {
    const message = new UpdateGameTableEntityPosition("id1", 30, 40);
    
    expect(message.type).toBe("updateGameTableEntityPosition");
    expect(message.id).toBe("id1");
    expect(message.x).toBe(30);
    expect(message.y).toBe(40);
    expect(message).toBeInstanceOf(ServerMessage);
  });
});

describe("UpdateGameTableEntityDetails", () => {
  it("should create instance with correct properties", () => {
    const entity = Tag.deserialize({
      id: "tag1",
      name: "test tag",
      isScratched: false,
      owner: "user1"
    });
    const message = new UpdateGameTableEntityDetails(entity);
    
    expect(message.type).toBe("updateGameTableEntityDetails");
    expect(message.entity).toBe(entity);
    expect(message).toBeInstanceOf(ServerMessage);
  });
});

describe("RollResponse", () => {
  it("should create instance with correct properties", () => {
    const message = new RollResponse("roll1", "You rolled 8!");
    
    expect(message.type).toBe("rollResponse");
    expect(message.id).toBe("roll1");
    expect(message.message).toBe("You rolled 8!");
    expect(message).toBeInstanceOf(ServerMessage);
  });
});