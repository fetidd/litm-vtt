import { describe, it, expect, mock } from "bun:test";
import { handleUpdateClientGameTableEntityPosition } from "@/handlers/updateClientGameTableEntityPosition";
import { UpdateGameTableEntityPosition } from "@/messaging/message";
import { Tag } from "@/litm/tag";

describe("handleUpdateClientGameTableEntityPosition", () => {
  it("should update entity position", () => {
    const mockSetter = mock(() => {});
    const existingEntities = [
      {
        entity: Tag.deserialize({
          id: "tag1",
          name: "test tag",
          isScratched: false,
          owner: "user1"
        }),
        position: { x: 10, y: 20 }
      },
      {
        entity: Tag.deserialize({
          id: "tag2",
          name: "other tag",
          isScratched: false,
          owner: "user1"
        }),
        position: { x: 30, y: 40 }
      }
    ];

    mockSetter.mockImplementation((fn) => {
      const result = fn(existingEntities);
      return result;
    });

    const message = new UpdateGameTableEntityPosition("tag1", 100, 200);
    
    handleUpdateClientGameTableEntityPosition(message, mockSetter);

    expect(mockSetter).toHaveBeenCalledTimes(1);
    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall(existingEntities);
    
    expect(result).toHaveLength(2);
    
    const updatedItem = result.find(e => e.entity.id === "tag1");
    const unchangedItem = result.find(e => e.entity.id === "tag2");
    
    expect(updatedItem?.position).toEqual({ x: 100, y: 200 });
    expect(unchangedItem?.position).toEqual({ x: 30, y: 40 });
  });

  it("should not modify entities that don't match ID", () => {
    const mockSetter = mock(() => {});
    const existingEntities = [
      {
        entity: Tag.deserialize({
          id: "tag1",
          name: "test tag",
          isScratched: false,
          owner: "user1"
        }),
        position: { x: 10, y: 20 }
      },
      {
        entity: Tag.deserialize({
          id: "tag2",
          name: "other tag",
          isScratched: false,
          owner: "user1"
        }),
        position: { x: 30, y: 40 }
      }
    ];

    mockSetter.mockImplementation((fn) => {
      const result = fn(existingEntities);
      return result;
    });

    const message = new UpdateGameTableEntityPosition("nonexistent", 100, 200);
    
    handleUpdateClientGameTableEntityPosition(message, mockSetter);

    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall(existingEntities);
    
    expect(result).toHaveLength(2);
    expect(result[0].position).toEqual({ x: 10, y: 20 });
    expect(result[1].position).toEqual({ x: 30, y: 40 });
  });

  it("should handle empty entities array", () => {
    const mockSetter = mock(() => {});
    mockSetter.mockImplementation((fn) => {
      const result = fn([]);
      return result;
    });

    const message = new UpdateGameTableEntityPosition("tag1", 100, 200);
    
    handleUpdateClientGameTableEntityPosition(message, mockSetter);

    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall([]);
    
    expect(result).toHaveLength(0);
  });
});