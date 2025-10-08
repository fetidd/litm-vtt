import { describe, it, expect } from "bun:test";
import { UpdateGameTableEntityDetails } from "@/messaging/message";
import { Tag } from "@/litm/tag";

describe("handleUpdateGameTableEntityDetails", () => {
  it("should create UpdateGameTableEntityDetails message correctly", () => {
    const entity = Tag.deserialize({
      id: "update-tag",
      name: "new name",
      isScratched: true,
      owner: "user1"
    });

    const message = new UpdateGameTableEntityDetails(entity);

    expect(message.type).toBe("updateGameTableEntityDetails");
    expect(message.entity).toBe(entity);
    expect(message.entity.id).toBe("update-tag");
    expect(message.entity.name).toBe("new name");
    expect(message.entity.isScratched).toBe(true);
  });
});