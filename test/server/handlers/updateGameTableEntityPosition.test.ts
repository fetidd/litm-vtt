import { describe, it, expect } from "bun:test";
import { UpdateGameTableEntityPosition } from "@/messaging/message";

describe("handleUpdateGameTableEntityPosition", () => {
  it("should create UpdateGameTableEntityPosition message correctly", () => {
    const message = new UpdateGameTableEntityPosition("entity1", 100, 200);

    expect(message.type).toBe("updateGameTableEntityPosition");
    expect(message.id).toBe("entity1");
    expect(message.x).toBe(100);
    expect(message.y).toBe(200);
  });

  it("should handle different entity IDs and positions", () => {
    const message = new UpdateGameTableEntityPosition("different-entity", 50, 75);
    
    expect(message.id).toBe("different-entity");
    expect(message.x).toBe(50);
    expect(message.y).toBe(75);
  });

  it("should handle negative coordinates", () => {
    const message = new UpdateGameTableEntityPosition("entity1", -10, -20);
    
    expect(message.x).toBe(-10);
    expect(message.y).toBe(-20);
  });

  it("should handle zero coordinates", () => {
    const message = new UpdateGameTableEntityPosition("entity1", 0, 0);
    
    expect(message.x).toBe(0);
    expect(message.y).toBe(0);
  });
});