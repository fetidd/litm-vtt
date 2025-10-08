import { describe, it, expect, mock } from "bun:test";
import { handleMessage } from "@/server/handler";
import LitmDatabase from "@/server/database";

describe("handleMessage", () => {
  it("should parse JSON message correctly", () => {
    const mockWs = { authToken: "test-token" };
    const mockDb = {} as LitmDatabase;
    const mockServer = {};
    
    const message = JSON.stringify({
      type: "unknownMessageType",
      data: "test"
    });

    const consoleSpy = mock(() => {});
    const originalWarn = console.warn;
    console.warn = consoleSpy;

    handleMessage(mockWs, message, mockDb, mockServer);

    expect(consoleSpy).toHaveBeenCalledWith("Unknown message type: unknownMessageType");
    
    console.warn = originalWarn;
  });

  it("should handle Buffer message", () => {
    const mockWs = { authToken: "test-token" };
    const mockDb = {} as LitmDatabase;
    const mockServer = {};
    
    const messageObj = {
      type: "unknownMessageType",
      data: "test"
    };
    const buffer = Buffer.from(JSON.stringify(messageObj));

    const consoleSpy = mock(() => {});
    const originalWarn = console.warn;
    console.warn = consoleSpy;

    handleMessage(mockWs, buffer, mockDb, mockServer);

    expect(consoleSpy).toHaveBeenCalledWith("Unknown message type: unknownMessageType");
    
    console.warn = originalWarn;
  });
});