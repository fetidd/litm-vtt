import { expect, test, describe } from "bun:test";
import { StoryTheme, HeroTheme } from "@/litm/theme";
import { Tag } from "@/litm/tag";

describe("StoryTheme can deserialize correctly", () => {
  test("Deserilaize no tags", () => {
    const raw = {id: "12345678", name: "test"};
    const actual = StoryTheme.deserialize(raw);
    const expected = new StoryTheme("test");
    expected.id = "12345678";
    expect(actual).toEqual(expected);
    unchangeableChecks(actual);
  });


  test("Deserialize with tags", () => {
    const raw = {id: "12345678", isScratched: false, name: "test", tags: [{id: "12345678", isScratched: false, name: "test-tag"}, {id: "12345678", isScratched: false, name: "test-tag2"}], weaknessTags: [{id: "12345678", isScratched: false, name: "test-weakness-tag"}], description: "desc"};
    const actual = StoryTheme.deserialize(raw);
    const expected = new StoryTheme("test");
    expected.id = "12345678";
    expected.tags = [
        Tag.deserialize({id: "12345678", isScratched: false, name: "test-tag"}),
        Tag.deserialize({id: "12345678", isScratched: false, name: "test-tag2"}),
    ];
    expected.weaknessTags = [Tag.deserialize({id: "12345678", isScratched: false, name: "test-weakness-tag"})]
    expected.description = "desc"
    expect(actual).toEqual(expected);
    unchangeableChecks(actual);
  });

  test("Raw input has changed StoryTheme rleated properties that shoudnt change", () => {
    const raw = {id: "12345678", isScratched: false, name: "test", tags: [], weaknessTags: [], description: "", canBurn: false};
    const actual = StoryTheme.deserialize(raw);
    const expected = new StoryTheme("test");
    expected.id = "12345678";
    expect(actual).toEqual(expected);
    unchangeableChecks(actual);
  });
});

function unchangeableChecks(actual: StoryTheme) {
    expect(actual.canBurn).toEqual(true);
    expect(actual.canScratch).toEqual(true);
    expect(actual.entityType).toEqual("story-theme");
    expect(actual.value).toEqual(1);
}




describe("HeroTheme can deserialize correctly", () => {
  test("Deserilaize no tags", () => {
    const raw = {id: "12345678", name: "test", might: "greatness", type: "destiny"};
    const actual = HeroTheme.deserialize(raw);
    const expected = new HeroTheme("test", "destiny", "greatness");
    expected.id = "12345678";
    expect(actual).toEqual(expected);
    unchangeableHeroThemeChecks(actual);
  });


  test("Deserialize with tags", () => {
    const raw = {
        id: "12345678", 
        isScratched: false, 
        name: "test",
        might: "greatness",
        type: "destiny",
        tags: [{id: "12345678", isScratched: false, name: "test-tag"}, {id: "12345678", isScratched: false, name: "test-tag2"}], 
        weaknessTags: [{id: "12345678", isScratched: false, name: "test-weakness-tag"}], 
        description: "desc"
    };
    const actual = HeroTheme.deserialize(raw);
    const expected = new HeroTheme("test", "destiny", "greatness");
    expected.id = "12345678";
    expected.tags = [
        Tag.deserialize({id: "12345678", isScratched: false, name: "test-tag"}),
        Tag.deserialize({id: "12345678", isScratched: false, name: "test-tag2"}),
    ];
    expected.weaknessTags = [Tag.deserialize({id: "12345678", isScratched: false, name: "test-weakness-tag"})]
    expected.description = "desc"
    expect(actual).toEqual(expected);
    unchangeableHeroThemeChecks(actual);
  });

  test("Raw input has changed HeroTheme rleated properties that shoudnt change", () => {
    const raw = {id: "12345678", isScratched: false, name: "test", might: "greatness", type: "destiny", tags: [], weaknessTags: [], description: "", canBurn: false};
    const actual = HeroTheme.deserialize(raw);
    const expected = new HeroTheme("test", "destiny", "greatness");
    expected.id = "12345678";
    expect(actual).toEqual(expected);
    expect(actual.canBurn).toEqual(true);
    unchangeableHeroThemeChecks(actual);
  });
});

function unchangeableHeroThemeChecks(actual: HeroTheme) {
    expect(actual.canBurn).toEqual(true);
    expect(actual.canScratch).toEqual(true);
    expect(actual.entityType).toEqual("hero-theme");
    expect(actual.value).toEqual(1);
}
