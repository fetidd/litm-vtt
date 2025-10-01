import { expect, test, describe } from "bun:test";
import { Tag } from "@/litm/tag";

describe("Tag can deserialize correctly", () => {
  test("Simple deserialize", () => {
    const raw = {
      id: "12345678",
      isScratched: false,
      name: "test",
      owner: "user",
    };
    const actual = Tag.deserialize(raw);
    const expected = Tag.blank();
    expected.name = "test";
    expected.id = "12345678";
    expected.owner = "user";
    expect(actual).toEqual(expected);
    expect(actual.serialize()).toEqual({ ...raw, entityType: "tag" });
  });
  test("Raw input has changed Tag rleated properties that shoudnt change", () => {
    const raw = {
      id: "12345678",
      isScratched: false,
      name: "test",
      canBurn: false,
      owner: "user",
    };
    const actual = Tag.deserialize(raw);
    const expected = Tag.blank();
    expected.name = "test";
    expected.id = "12345678";
    expected.owner = "user";
    expect(actual).toEqual(expected);
    expect(actual.canBurn).toEqual(true);
    const correctSerialized = { ...raw, entityType: "tag" };
    // @ts-ignore
    delete correctSerialized.canBurn;
    expect(actual.serialize()).toEqual(correctSerialized);
  });
});
