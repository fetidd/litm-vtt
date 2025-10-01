import { expect, test, describe } from "bun:test";
import { StoryTheme, HeroTheme } from "@/litm/theme";
import { Tag } from "@/litm/tag";

describe("StoryTheme can deserialize correctly", () => {
  test("Deserialize with tags", () => {
    const raw = {
      id: "12345678",
      isScratched: false,
      name: "test",
      otherTags: [
        { id: "12345678", isScratched: false, name: "test-tag", owner: "user" },
        {
          id: "12345678",
          isScratched: false,
          name: "test-tag2",
          owner: "user",
        },
      ],
      weaknessTags: [
        {
          id: "12345678",
          isScratched: false,
          name: "test-weakness-tag",
          owner: "user",
        },
      ],
      description: "desc",
      owner: "user",
    };
    const actual = StoryTheme.deserialize(raw);
    const expected = StoryTheme.blank();
    expected.name = "test";
    expected.id = "12345678";
    expected.owner = "user";
    expected.otherTags = [
      Tag.deserialize({
        id: "12345678",
        isScratched: false,
        name: "test-tag",
        owner: "user",
      }),
      Tag.deserialize({
        id: "12345678",
        isScratched: false,
        name: "test-tag2",
        owner: "user",
      }),
    ];
    expected.weaknessTags = [
      Tag.deserialize({
        id: "12345678",
        isScratched: false,
        name: "test-weakness-tag",
        owner: "user",
      }),
    ];
    expected.description = "desc";
    expect(actual).toEqual(expected);
    unchangeableChecks(actual);
    expect(actual.serialize()).toEqual({ ...raw, entityType: "story-theme" });
  });

  test("Raw input has changed StoryTheme rleated properties that shoudnt change", () => {
    const raw = {
      id: "12345678",
      isScratched: false,
      name: "test",
      otherTags: [],
      weaknessTags: [],
      description: "",
      canBurn: false,
      owner: "user",
    };
    const actual = StoryTheme.deserialize(raw);
    const expected = StoryTheme.blank();
    expected.name = "test";
    expected.id = "12345678";
    expected.owner = "user";
    expect(actual).toEqual(expected);
    unchangeableChecks(actual);
    expect(actual.serialize()).toEqual({ ...raw, entityType: "story-theme" });
  });
});

function unchangeableChecks(actual: StoryTheme) {
  expect(actual.canBurn).toEqual(true);
  expect(actual.canScratch).toEqual(true);
  expect(actual.entityType).toEqual("story-theme");
  expect(actual.value).toEqual(1);
}

describe("HeroTheme can deserialize correctly", () => {
  test("Deserialize with tags", () => {
    const raw = {
      id: "12345678",
      isScratched: false,
      name: "test",
      might: "greatness",
      type: "destiny",
      improve: 0,
      milestone: 1,
      abandon: 2,
      quest: "quest",
      description: "description",
      specialImprovements: ["improvement-1", "improvement-2"],
      otherTags: [
        {
          id: "12345678",
          isScratched: false,
          name: "test-tag",
          owner: "user",
          entityType: "tag",
        },
        {
          id: "12345678",
          isScratched: false,
          name: "test-tag2",
          owner: "user",
          entityType: "tag",
        },
      ],
      weaknessTags: [
        {
          id: "12345678",
          isScratched: false,
          name: "test-weakness-tag",
          owner: "user",
          entityType: "tag",
        },
      ],
      owner: "user",
    };
    const actual = HeroTheme.deserialize(raw);
    const expected = HeroTheme.blank();
    expected.name = "test";
    expected.id = "12345678";
    expected.might = "greatness";
    expected.type = "destiny";
    expected.owner = "user";
    expected.otherTags = [
      Tag.deserialize({
        id: "12345678",
        isScratched: false,
        name: "test-tag",
        owner: "user",
      }),
      Tag.deserialize({
        id: "12345678",
        isScratched: false,
        name: "test-tag2",
        owner: "user",
      }),
    ];
    expected.weaknessTags = [
      Tag.deserialize({
        id: "12345678",
        isScratched: false,
        name: "test-weakness-tag",
        owner: "user",
      }),
    ];
    expected.description = "desc";
    expected.improve = 0;
    expected.milestone = 1;
    expected.abandon = 2;
    expected.quest = "quest";
    expected.description = "description";
    expected.specialImprovements = ["improvement-1", "improvement-2"];
    expect(actual).toEqual(expected);
    unchangeableHeroThemeChecks(actual);
    expect(actual.serialize()).toEqual({ ...raw, entityType: "hero-theme" });
  });

  test("Raw input has changed HeroTheme rleated properties that shoudnt change", () => {
    const raw = {
      id: "12345678",
      isScratched: false,
      name: "test",
      might: "greatness",
      type: "destiny",
      otherTags: [],
      weaknessTags: [],
      canBurn: false,
      owner: "user",
      improve: 0,
      milestone: 1,
      abandon: 2,
      quest: "quest",
      description: "description",
      specialImprovements: ["improvement-1", "improvement-2"],
    };
    const actual = HeroTheme.deserialize(raw);
    const expected = HeroTheme.blank();
    expected.name = "test";
    expected.id = "12345678";
    expected.might = "greatness";
    expected.type = "destiny";
    expected.owner = "user";
    expected.improve = 0;
    expected.milestone = 1;
    expected.abandon = 2;
    expected.quest = "quest";
    expected.description = "description";
    expected.specialImprovements = ["improvement-1", "improvement-2"];
    expect(actual).toEqual(expected);
    expect(actual.canBurn).toEqual(true);
    unchangeableHeroThemeChecks(actual);
    const correctSerialized = { ...raw, entityType: "hero-theme" };
    // @ts-ignore
    delete correctSerialized.canBurn;
    expect(actual.serialize()).toEqual(correctSerialized);
  });
});

function unchangeableHeroThemeChecks(actual: HeroTheme) {
  expect(actual.canBurn).toEqual(true);
  expect(actual.canScratch).toEqual(true);
  expect(actual.entityType).toEqual("hero-theme");
  expect(actual.value).toEqual(1);
}
