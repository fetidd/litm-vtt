import { describe, it, expect, mock } from "bun:test";
import { handleClientDrawerEntitySync } from "@/handlers/clientDrawerEntitySync";
import { Tag } from "@/litm/tag";
import { Hero } from "@/litm/hero";

describe("handleClientDrawerEntitySync", () => {
  it("should deserialize entities and call setter", () => {
    const mockSetter = mock(() => {});
    const entities = [
      {
        id: "tag1",
        name: "test tag",
        isScratched: false,
        owner: "user1",
        entityType: "tag"
      },
      {
        id: "hero1",
        name: "Test Hero",
        promise: 2,
        description: "",
        themes: [],
        backpack: [],
        relationships: [],
        fellowship: undefined,
        owner: "user1",
        entityType: "hero"
      }
    ];

    handleClientDrawerEntitySync({ entities }, mockSetter);

    expect(mockSetter).toHaveBeenCalledTimes(1);
    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall();
    
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Tag);
    expect(result[0].id).toBe("tag1");
    expect(result[1]).toBeInstanceOf(Hero);
    expect(result[1].id).toBe("hero1");
  });

  it("should handle empty entities array", () => {
    const mockSetter = mock(() => {});
    
    handleClientDrawerEntitySync({ entities: [] }, mockSetter);

    expect(mockSetter).toHaveBeenCalledTimes(1);
    const setterCall = mockSetter.mock.calls[0][0];
    const result = setterCall();
    
    expect(result).toHaveLength(0);
  });
});