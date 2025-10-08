import { describe, it, expect, mock } from "bun:test";
import { handleRollResponse } from "@/handlers/rollResponse";
import { RollResponse } from "@/messaging/message";

describe("handleRollResponse", () => {
  it("should add roll message to existing messages", () => {
    const mockSetter = mock(() => {});
    const existingMessages = [
      { id: "roll1", text: "Previous roll" }
    ];
    mockSetter.mockImplementation((fn) => {
      const result = fn(existingMessages);
      return result;
    });

    const rollResponse = new RollResponse("roll2", "You rolled 12!");
    
    handleRollResponse(rollResponse, mockSetter);

    expect(mockSetter).toHaveBeenCalledTimes(1);
    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall(existingMessages);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: "roll1", text: "Previous roll" });
    expect(result[1]).toEqual({ id: "roll2", text: "You rolled 12!" });
  });

  it("should add roll message to empty array", () => {
    const mockSetter = mock(() => {});
    mockSetter.mockImplementation((fn) => {
      const result = fn([]);
      return result;
    });

    const rollResponse = new RollResponse("roll1", "You rolled 8!");
    
    handleRollResponse(rollResponse, mockSetter);

    expect(mockSetter).toHaveBeenCalledTimes(1);
    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall([]);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: "roll1", text: "You rolled 8!" });
  });

  it("should preserve message order", () => {
    const mockSetter = mock(() => {});
    const existingMessages = [
      { id: "roll1", text: "First roll" },
      { id: "roll2", text: "Second roll" }
    ];
    mockSetter.mockImplementation((fn) => {
      const result = fn(existingMessages);
      return result;
    });

    const rollResponse = new RollResponse("roll3", "Third roll");
    
    handleRollResponse(rollResponse, mockSetter);

    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall(existingMessages);
    
    expect(result).toHaveLength(3);
    expect(result[0].text).toBe("First roll");
    expect(result[1].text).toBe("Second roll");
    expect(result[2].text).toBe("Third roll");
  });
});