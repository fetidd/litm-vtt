import { expect, test, describe } from "bun:test";
import { Status } from "@/litm/status";

describe("Status can deserialize correctly", () => {
  test("Simple deserialize", () => {
    const raw = {id: "12345678", isScratched: false, name: "test", _tiers: [1]};
    const actual = Status.deserialize(raw);
    const expected = new Status("test");
    expected.id = "12345678";
    expected.tiers = [1]
    expect(actual).toEqual(expected);
    expect(actual.value).toEqual(1)
  });
  test("Simple deserialize with tiers", () => {
    const raw = {id: "12345678", isScratched: false, name: "test", _tiers: [3]};
    const actual = Status.deserialize(raw);
    const expected = new Status("test");
    expected.id = "12345678";
    expected.tiers = [3]
    expect(actual).toEqual(expected);
    expect(actual.value).toEqual(3)
  });
  test("Raw input has changed Status rleated properties that shoudnt change", () => {
    const raw = {id: "12345678", isScratched: true, name: "test", canBurn: true, _tiers: [2,5]};
    const actual = Status.deserialize(raw);
    const expected = new Status("test");
    expected.id = "12345678";
    expected.tiers = [2,5]
    expect(actual).toEqual(expected);
    expect(actual.value).toEqual(5)
    expect(actual.canBurn).toEqual(false);
  })
});
