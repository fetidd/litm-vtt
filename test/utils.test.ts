import { describe, it, expect } from "bun:test";
import { generateId } from "@/utils";

describe("utils", () => {
  describe("generateId", () => {
    it("should generate a UUID string", () => {
      const id = generateId();
      
      expect(typeof id).toBe("string");
      expect(id.length).toBe(36);
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it("should generate unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
    });

    it("should generate multiple unique IDs", () => {
      const ids = Array.from({ length: 100 }, () => generateId());
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(100);
    });
  });
});