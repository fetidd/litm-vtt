import { describe, it, expect } from "bun:test";
import { DeleteGameTableEntity } from "@/messaging/message";

describe("handleDeleteGameTableEntity", () => {
  it("should create DeleteGameTableEntity message correctly", () => {
    const message = new DeleteGameTableEntity("delete-tag", "tag");

    expect(message.type).toBe("deleteGameTableEntity");
    expect(message.id).toBe("delete-tag");
    expect(message.entityType).toBe("tag");
  });

  it("should handle status entity type", () => {
    const message = new DeleteGameTableEntity("delete-status", "status");

    expect(message.type).toBe("deleteGameTableEntity");
    expect(message.id).toBe("delete-status");
    expect(message.entityType).toBe("status");
  });
});