import { describe, it, expect } from "bun:test";
import User from "@/user";

describe("User", () => {
  describe("constructor", () => {
    it("should create user with username and role", () => {
      const user = new User("testUser", "player");
      
      expect(user.username).toBe("testUser");
      expect(user.role).toBe("player");
    });

    it("should create narrator user", () => {
      const user = new User("narrator1", "narrator");
      
      expect(user.username).toBe("narrator1");
      expect(user.role).toBe("narrator");
    });
  });

  describe("serialize", () => {
    it("should serialize user to object", () => {
      const user = new User("testUser", "player");
      const serialized = user.serialize();
      
      expect(serialized).toEqual({
        username: "testUser",
        role: "player"
      });
    });

    it("should serialize narrator user", () => {
      const user = new User("narrator1", "narrator");
      const serialized = user.serialize();
      
      expect(serialized).toEqual({
        username: "narrator1",
        role: "narrator"
      });
    });
  });

  describe("deserialize", () => {
    it("should deserialize valid user data", () => {
      const raw = {
        username: "testUser",
        role: "player"
      };
      
      const user = User.deserialize(raw);
      
      expect(user).toBeInstanceOf(User);
      expect(user.username).toBe("testUser");
      expect(user.role).toBe("player");
    });

    it("should deserialize narrator user", () => {
      const raw = {
        username: "narrator1",
        role: "narrator"
      };
      
      const user = User.deserialize(raw);
      
      expect(user).toBeInstanceOf(User);
      expect(user.username).toBe("narrator1");
      expect(user.role).toBe("narrator");
    });

    it("should throw error for missing username", () => {
      const raw = {
        role: "player"
      };
      
      expect(() => User.deserialize(raw)).toThrow("Failed to deserialize User");
      expect(() => User.deserialize(raw)).toThrow("missing username");
    });

    it("should throw error for missing role", () => {
      const raw = {
        username: "testUser"
      };
      
      expect(() => User.deserialize(raw)).toThrow("Failed to deserialize User");
      expect(() => User.deserialize(raw)).toThrow("missing role");
    });

    it("should throw error for invalid data", () => {
      const raw = null;
      
      expect(() => User.deserialize(raw)).toThrow("Failed to deserialize User");
    });

    it("should include original data in error message", () => {
      const raw = { invalid: "data" };
      
      expect(() => User.deserialize(raw)).toThrow(JSON.stringify(raw));
    });
  });
});