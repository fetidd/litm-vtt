import { expect, test, describe } from "bun:test";
import { Status } from "@/litm/status";

describe("Status can deserialize correctly", () => {
  test("Simple deserialize", () => {
    const raw = { id: "12345678", name: "test", tiers: [1], owner: "user" };
    const actual = Status.deserialize(raw);
    const expected = Status.blank();
    expected.name = "test";
    expected.id = "12345678";
    expected.tiers = [1];
    expected.owner = "user";
    expect(actual).toEqual(expected);
    expect(actual.value).toEqual(1);
    expect(actual.serialize()).toEqual({ ...raw, entityType: "status" });
  });
  test("Simple deserialize with tiers", () => {
    const raw = { id: "12345678", name: "test", tiers: [3], owner: "user" };
    const actual = Status.deserialize(raw);
    const expected = Status.blank();
    expected.name = "test";
    expected.id = "12345678";
    expected.tiers = [3];
    expected.owner = "user";
    expect(actual).toEqual(expected);
    expect(actual.value).toEqual(3);
    expect(actual.serialize()).toEqual({ ...raw, entityType: "status" });
  });
  test("Raw input has changed Status rleated properties that shoudnt change", () => {
    const raw = {
      id: "12345678",
      isScratched: true,
      name: "test",
      canBurn: true,
      tiers: [2, 5],
      owner: "user",
    };
    const actual = Status.deserialize(raw);
    const expected = Status.blank();
    expected.name = "test";
    expected.id = "12345678";
    expected.tiers = [2, 5];
    expected.owner = "user";
    expect(actual).toEqual(expected);
    expect(actual.value).toEqual(5);
    expect(actual.canBurn).toEqual(false);
    expect(actual.isScratched).toEqual(false);
    const correctSerialized = { ...raw, entityType: "status" };
    // @ts-ignore
    delete correctSerialized.canBurn;
    // @ts-ignore
    delete correctSerialized.isScratched;
    expect(actual.serialize()).toEqual(correctSerialized);
  });
});
