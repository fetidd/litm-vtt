import { describe, it, expect } from "bun:test";
import { RollRequest } from "@/messaging/message";

describe("handleRollRequest", () => {
  it("should create RollRequest message correctly", () => {
    const message = new RollRequest("roll 2d6+3");

    expect(message.type).toBe("rollRequest");
    expect(message.message).toBe("roll 2d6+3");
  });

  it("should handle different roll messages", () => {
    const message = new RollRequest("attack with sword");
    
    expect(message.type).toBe("rollRequest");
    expect(message.message).toBe("attack with sword");
  });

  it("should handle empty roll message", () => {
    const message = new RollRequest("");
    
    expect(message.type).toBe("rollRequest");
    expect(message.message).toBe("");
  });
});