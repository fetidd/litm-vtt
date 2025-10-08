import { describe, it, expect, mock } from "bun:test";
import { handleUpdateClientGameTableEntityDetails } from "@/handlers/updateClientGameTableEntityDetails";
import { UpdateClientGameTableEntityDetails } from "@/messaging/message";
import { Tag } from "@/litm/tag";

describe("handleUpdateClientGameTableEntityDetails", () => {
  it("should update existing entity details", () => {
    const mockSetter = mock(() => {});
    const existingEntities = [
      {
        entity: Tag.deserialize({
          id: "tag1",
          name: "old name",
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

    const updatedEntity = Tag.deserialize({
      id: "tag1",
      name: "new name",
      isScratched: true,
      owner: "user1"
    });

    const message = new UpdateClientGameTableEntityDetails(updatedEntity);
    
    handleUpdateClientGameTableEntityDetails(message, mockSetter);

    expect(mockSetter).toHaveBeenCalledTimes(1);
    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall(existingEntities);
    
    expect(result).toHaveLength(2);
    
    const updatedItem = result.find(e => e.entity.id === "tag1");
    const unchangedItem = result.find(e => e.entity.id === "tag2");
    
    expect(updatedItem?.entity.name).toBe("new name");
    expect(updatedItem?.entity.isScratched).toBe(true);
    expect(updatedItem?.position).toEqual({ x: 10, y: 20 });
    
    expect(unchangedItem?.entity.name).toBe("other tag");
    expect(unchangedItem?.position).toEqual({ x: 30, y: 40 });
  });

  it("should throw error if entity not found", () => {
    const mockSetter = mock(() => {});
    const existingEntities = [
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
      fn(existingEntities);
    });

    const updatedEntity = Tag.deserialize({
      id: "tag1",
      name: "new name",
      isScratched: true,
      owner: "user1"
    });

    const message = new UpdateClientGameTableEntityDetails(updatedEntity);
    
    expect(() => {
      handleUpdateClientGameTableEntityDetails(message, mockSetter);
    }).toThrow("We are trying to update entity data the client doesnt have!");
  });

  it("should handle empty entities array", () => {
    const mockSetter = mock(() => {});
    mockSetter.mockImplementation((fn) => {
      fn([]);
    });

    const updatedEntity = Tag.deserialize({
      id: "tag1",
      name: "new name",
      isScratched: true,
      owner: "user1"
    });

    const message = new UpdateClientGameTableEntityDetails(updatedEntity);
    
    expect(() => {
      handleUpdateClientGameTableEntityDetails(message, mockSetter);
    }).toThrow("We are trying to update entity data the client doesnt have!");
  });
});