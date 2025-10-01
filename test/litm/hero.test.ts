import { expect, test, describe } from "bun:test";
import { Hero } from "@/litm/hero";
import { Fellowship } from "@/litm/fellowship";

describe("Hero can deserialize correctly", () => {
  test("Simple deserialize", () => {
    const raw = {
      id: "12345678",
      name: "test",
      owner: "user",
      description: "description",
      themes: [],
      backpack: [],
      fellowship: undefined,
      relationships: [],
      promise: 2,
    };
    const actual = Hero.deserialize(raw);
    const expected = Hero.blank();
    expected.id = "12345678";
    expected.name = "test";
    expected.owner = "user";
    expected.description = "description";
    expected.fellowship = undefined;
    expected.relationships = new Map();
    expected.themes = [];
    expected.backpack = [];
    expected.promise = 2;
    expect(actual).toEqual(expected);
    expect(actual.serialize()).toEqual({ ...raw, entityType: "hero" }); // TODO should entityType  be validated in deserialize too?
  });
});
