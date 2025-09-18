import { expect, test, describe } from "bun:test";
import { Tag } from "@/litm/tag";

describe("Tag can deserialize correctly", () => {
  test("Simple deserialize", () => {
    const raw = {id: "12345678", isScratched: false, name: "test"};
    const actual = Tag.deserialize(raw);
    const expected = new Tag("test");
    expected.id = "12345678";
    expect(actual).toEqual(expected);
  });
  test("Raw input has changed Tag rleated properties that shoudnt change", () => {
    const raw = {id: "12345678", isScratched: false, name: "test", canBurn: false};
    const actual = Tag.deserialize(raw);
    const expected = new Tag("test");
    expected.id = "12345678";
    expect(actual).toEqual(expected);
    expect(actual.canBurn).toEqual(true);
  });
});
