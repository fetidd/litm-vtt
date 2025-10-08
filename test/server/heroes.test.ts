import { describe, it, expect } from "bun:test";
import { fellowship1, hero } from "@/server/heroes";
import { Fellowship } from "@/litm/fellowship";
import { Hero } from "@/litm/hero";
import { Tag } from "@/litm/tag";
import { HeroTheme } from "@/litm/theme";

describe("heroes", () => {
  describe("fellowship1", () => {
    it("should be a valid Fellowship instance", () => {
      expect(fellowship1).toBeInstanceOf(Fellowship);
      expect(fellowship1.id).toBe("example-fellowship-1");
      expect(fellowship1.name).toBe("Fellowship of the Amulet");
      expect(fellowship1.owner).toBe("ben");
      expect(fellowship1.isScratched).toBe(false);
    });

    it("should have correct quest and description", () => {
      expect(fellowship1.quest).toBe("We must carry the Amulet into the Sea of Endings, and destroy it once and for all.");
      expect(fellowship1.description).toBe("");
    });

    it("should have advancement values", () => {
      expect(fellowship1.milestone).toBe(1);
      expect(fellowship1.abandon).toBe(2);
      expect(fellowship1.improve).toBe(1);
    });

    it("should have other tags", () => {
      expect(fellowship1.otherTags).toHaveLength(2);
      expect(fellowship1.otherTags[0]).toBeInstanceOf(Tag);
      expect(fellowship1.otherTags[0].name).toBe("hidden campsites");
      expect(fellowship1.otherTags[1].name).toBe("hiding from foes");
    });

    it("should have weakness tags", () => {
      expect(fellowship1.weaknessTags).toHaveLength(1);
      expect(fellowship1.weaknessTags[0]).toBeInstanceOf(Tag);
      expect(fellowship1.weaknessTags[0].name).toBe("growing mistrust");
    });

    it("should have empty special improvements", () => {
      expect(fellowship1.specialImprovements).toHaveLength(0);
    });
  });

  describe("hero", () => {
    it("should be a valid Hero instance", () => {
      expect(hero).toBeInstanceOf(Hero);
      expect(hero.id).toBe("example-hero-1");
      expect(hero.name).toBe("Gorm Cowtipper");
      expect(hero.promise).toBe(2);
      expect(hero.owner).toBe("ben");
    });

    it("should have correct description", () => {
      expect(hero.description).toBe("");
    });

    it("should have fellowship reference", () => {
      expect(hero.fellowship?.id).toBe(fellowship1.id);
      expect(hero.fellowship?.name).toBe(fellowship1.name);
    });

    it("should have four themes", () => {
      expect(hero.themes).toHaveLength(4);
      expect(hero.themes[0]).toBeInstanceOf(HeroTheme);
      
      const themeNames = hero.themes.map(t => t.name);
      expect(themeNames).toContain("Cursed");
      expect(themeNames).toContain("Heart of Gold");
      expect(themeNames).toContain("Strong as an Ox");
      expect(themeNames).toContain("Irksome Pixie");
    });

    it("should have backpack items", () => {
      expect(hero.backpack).toHaveLength(4);
      expect(hero.backpack[0]).toBeInstanceOf(Tag);
      
      const backpackItems = hero.backpack.map(t => t.name);
      expect(backpackItems).toContain("large steel sword");
      expect(backpackItems).toContain("dice");
      expect(backpackItems).toContain("flint");
      expect(backpackItems).toContain("compass");
    });

    it("should have relationships", () => {
      expect(hero.relationships).toHaveLength(1);
      expect(hero.relationships.get("Geoff")).toBeInstanceOf(Tag);
      expect(hero.relationships.get("Geoff")?.name).toBe("best friends");
    });

    describe("themes", () => {
      it("should have Cursed theme with correct properties", () => {
        const cursedTheme = hero.themes.find(t => t.name === "Cursed");
        expect(cursedTheme).toBeDefined();
        expect(cursedTheme?.type).toBe("past");
        expect(cursedTheme?.might).toBe("origin");
        expect(cursedTheme?.quest).toBe("I must find a way to free myself of this curse.");
        expect(cursedTheme?.otherTags).toHaveLength(2);
        expect(cursedTheme?.weaknessTags).toHaveLength(1);
        expect(cursedTheme?.specialImprovements).toHaveLength(2);
      });

      it("should have Heart of Gold theme with correct properties", () => {
        const heartTheme = hero.themes.find(t => t.name === "Heart of Gold");
        expect(heartTheme).toBeDefined();
        expect(heartTheme?.type).toBe("personality");
        expect(heartTheme?.quest).toBe("There's hardship to go around - let's carry it together.");
        expect(heartTheme?.otherTags).toHaveLength(2);
        expect(heartTheme?.weaknessTags).toHaveLength(1);
        expect(heartTheme?.specialImprovements).toHaveLength(0);
      });

      it("should have Strong as an Ox theme with correct properties", () => {
        const strongTheme = hero.themes.find(t => t.name === "Strong as an Ox");
        expect(strongTheme).toBeDefined();
        expect(strongTheme?.type).toBe("trait");
        expect(strongTheme?.quest).toBe("The only way to get stronger is to keep testing my strength!");
        expect(strongTheme?.otherTags).toHaveLength(2);
        expect(strongTheme?.weaknessTags).toHaveLength(1);
        expect(strongTheme?.specialImprovements).toHaveLength(1);
      });

      it("should have Irksome Pixie theme with correct properties", () => {
        const pixieTheme = hero.themes.find(t => t.name === "Irksome Pixie");
        expect(pixieTheme).toBeDefined();
        expect(pixieTheme?.type).toBe("companion");
        expect(pixieTheme?.quest).toBe("This is going to be the biggest prank yet!");
        expect(pixieTheme?.otherTags).toHaveLength(2);
        expect(pixieTheme?.weaknessTags).toHaveLength(1);
        expect(pixieTheme?.specialImprovements).toHaveLength(0);
      });
    });
  });
});