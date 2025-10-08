import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import LitmDatabase from "@/server/database";
import { Tag } from "@/litm/tag";
import { Status } from "@/litm/status";
import { Hero } from "@/litm/hero";
import { HeroTheme } from "@/litm/theme";
import { Fellowship } from "@/litm/fellowship";
import { unlinkSync } from "fs";

describe("LitmDatabase", () => {
  let db: LitmDatabase;
  const testDbPath = "test-db.sqlite";

  beforeEach(() => {
    db = new LitmDatabase(testDbPath);
  });

  afterEach(() => {
    try {
      unlinkSync(testDbPath);
    } catch {}
  });

  describe("constructor", () => {
    it("should create database and bootstrap with sample data", () => {
      expect(db.db).toBeDefined();
      
      const tags = db.getAllTagsWithPositions();
      expect(tags.length).toBeGreaterThan(0);
      
      const statuses = db.getAllStatusesWithPositions();
      expect(statuses.length).toBeGreaterThan(0);
      
      const heroes = db.getAllHeroes();
      expect(heroes.length).toBeGreaterThan(0);
    });
  });

  describe("insertTag", () => {
    it("should insert tag successfully", () => {
      const tag = Tag.deserialize({
        id: "test-tag",
        name: "test tag",
        isScratched: false,
        owner: "testuser"
      });

      const result = db.insertTag(tag);
      expect(result.changes).toBe(1);

      const retrieved = db.getTagById("test-tag");
      expect(retrieved.name).toBe("test tag");
      expect(retrieved.isScratched).toBe(false);
      expect(retrieved.owner).toBe("testuser");
    });
  });

  describe("insertStatus", () => {
    it("should insert status successfully", () => {
      const status = Status.deserialize({
        id: "test-status",
        name: "test status",
        tiers: [1, 2],
        owner: "testuser"
      });

      const result = db.insertStatus(status);
      expect(result.changes).toBe(1);
    });
  });

  describe("getTagById", () => {
    it("should retrieve existing tag", () => {
      const tag = db.getTagById("example-tag-0");
      expect(tag).toBeInstanceOf(Tag);
      expect(tag.name).toBe("sharp");
    });

    it("should throw error for non-existent tag", () => {
      expect(() => db.getTagById("nonexistent")).toThrow("Tag nonexistent does not exist");
    });
  });

  describe("addEntityToGameBoard", () => {
    it("should add entity to game board", () => {
      const tag = Tag.deserialize({
        id: "board-tag",
        name: "board tag",
        isScratched: false,
        owner: "testuser"
      });
      
      db.insertTag(tag);
      db.addEntityToGameBoard(tag, 100, 200);

      const entities = db.getAllTagsWithPositions();
      const boardTag = entities.find(e => e.entity.id === "board-tag");
      
      expect(boardTag).toBeDefined();
      expect(boardTag?.position).toEqual({ x: 100, y: 200 });
    });
  });

  describe("updateTag", () => {
    it("should update existing tag", () => {
      const originalTag = db.getTagById("example-tag-0");
      originalTag.name = "updated name";
      originalTag.isScratched = true;

      const result = db.updateTag(originalTag);
      expect(result.changes).toBe(1);

      const updatedTag = db.getTagById("example-tag-0");
      expect(updatedTag.name).toBe("updated name");
      expect(updatedTag.isScratched).toBe(true);
    });
  });

  describe("updateEntityPosition", () => {
    it("should update entity position", () => {
      db.updateEntityPosition("example-tag-0", 500, 600);

      const entities = db.getAllTagsWithPositions();
      const updatedEntity = entities.find(e => e.entity.id === "example-tag-0");
      
      expect(updatedEntity?.position).toEqual({ x: 500, y: 600 });
    });
  });

  describe("deleteEntity", () => {
    it("should delete tag entity", () => {
      const tag = Tag.deserialize({
        id: "delete-tag",
        name: "delete me",
        isScratched: false,
        owner: "testuser"
      });
      
      db.insertTag(tag);
      db.addEntityToGameBoard(tag, 10, 20);

      db.deleteEntity("delete-tag", "tag");

      expect(() => db.getTagById("delete-tag")).toThrow();
      
      const entities = db.getAllTagsWithPositions();
      const deletedEntity = entities.find(e => e.entity.id === "delete-tag");
      expect(deletedEntity).toBeUndefined();
    });
  });

  describe("getAllHeroes", () => {
    it("should return all heroes with relationships", () => {
      const heroes = db.getAllHeroes();
      
      expect(heroes.length).toBeGreaterThan(0);
      expect(heroes[0]).toBeInstanceOf(Hero);
      expect(heroes[0]!.themes.length).toBeGreaterThan(0);
      expect(heroes[0]!.backpack.length).toBeGreaterThan(0);
    });
  });

  describe("insertEntityList", () => {
    it("should insert list of entities and return string", () => {
      const tags = [
        Tag.deserialize({ id: "list-tag-1", name: "tag 1", isScratched: false, owner: "user" }),
        Tag.deserialize({ id: "list-tag-2", name: "tag 2", isScratched: false, owner: "user" })
      ];

      const result = db.insertEntityList(tags, db.insertTag.bind(db));
      
      expect(result).toBe("list-tag-1+++list-tag-2");
      expect(() => db.getTagById("list-tag-1")).not.toThrow();
      expect(() => db.getTagById("list-tag-2")).not.toThrow();
    });
  });

  describe("trimListString", () => {
    it("should trim join characters from end", () => {
      const result = db.trimListString("item1+++item2+++");
      expect(result).toBe("item1+++item2");
    });

    it("should handle empty string", () => {
      const result = db.trimListString("");
      expect(result).toBe("");
    });
  });
});