import { describe, it, expect, mock } from "bun:test";
import { handleClientGameTableEntitySync } from "@/handlers/clientGameTableEntitySync";
import { Tag } from "@/litm/tag";

describe("handleClientGameTableEntitySync", () => {
  it("should deserialize entities and call setter with position data", () => {
    const mockSetter = mock(() => {});
    const entities = [
      {
        entity: {
          id: "tag1",
          name: "test tag",
          isScratched: false,
          owner: "user1",
          entityType: "tag"
        },
        position: { x: 10, y: 20 }
      }
    ];

    handleClientGameTableEntitySync({ entities }, mockSetter);

    expect(mockSetter).toHaveBeenCalledTimes(1);
    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall();
    
    expect(result).toHaveLength(1);
    expect(result[0].entity).toBeInstanceOf(Tag);
    expect(result[0].entity.id).toBe("tag1");
    expect(result[0].position).toEqual({ x: 10, y: 20 });
  });

  it("should handle multiple entities", () => {
    const mockSetter = mock(() => {});
    const entities = [
      {
        entity: {
          id: "tag1",
          name: "test tag 1",
          isScratched: false,
          owner: "user1",
          entityType: "tag"
        },
        position: { x: 10, y: 20 }
      },
      {
        entity: {
          id: "tag2",
          name: "test tag 2",
          isScratched: true,
          owner: "user2",
          entityType: "tag"
        },
        position: { x: 30, y: 40 }
      }
    ];

    handleClientGameTableEntitySync({ entities }, mockSetter);

    expect(mockSetter).toHaveBeenCalledTimes(1);
    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall();
    
    expect(result).toHaveLength(2);
    expect(result[0].entity.id).toBe("tag1");
    expect(result[0].position).toEqual({ x: 10, y: 20 });
    expect(result[1].entity.id).toBe("tag2");
    expect(result[1].position).toEqual({ x: 30, y: 40 });
  });

  it("should handle empty entities array", () => {
    const mockSetter = mock(() => {});
    
    handleClientGameTableEntitySync({ entities: [] }, mockSetter);

    expect(mockSetter).toHaveBeenCalledTimes(1);
    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall();
    
    expect(result).toHaveLength(0);
  });
});