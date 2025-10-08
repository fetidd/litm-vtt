import { describe, it, expect } from "bun:test";
import { CreateNewGameTableEntity } from "@/messaging/message";
import { Tag } from "@/litm/tag";

describe("handleCreateNewGameTableEntity", () => {
  it("should create CreateNewGameTableEntity message correctly", () => {
    const entity = Tag.deserialize({
      id: "new-tag",
      name: "new tag",
      isScratched: false,
      owner: "user1"
    });

    const message = new CreateNewGameTableEntity(entity, 50, 75);

    expect(message.type).toBe("createNewGameTableEntity");
    expect(message.entity).toBe(entity);
    expect(message.x).toBe(50);
    expect(message.y).toBe(75);
  });
});