import { spaces } from "./string";

describe("spaces", () => {
  test("Number of spaces", () => {
    expect(spaces(30).length).toBe(30);
  });
});
