import parseHeaderLine from './parse-header';

describe("parseHeaderLine", () => {
  test("Confirmed and description", () => {
    expect(parseHeaderLine("2021-11-02 * Description")).toEqual({
      date: new Date("2021-11-02"),
      confirmed: true,
      description: "Description",
    });
  });

  test("Not confirmed", () => {
    expect(parseHeaderLine("2021-11-02 Foo")).toEqual({
      date: new Date("2021-11-02"),
      confirmed: false,
      description: "Foo",
    });
  });

  test("No description", () => {
    expect(parseHeaderLine("2021-11-02")).toEqual({
      date: new Date("2021-11-02"),
      confirmed: false,
      description: "",
    });
  });
  test("Comments", () => {
    expect(parseHeaderLine("2021-11-12 * wololo ; that is nice")).toEqual({
      date: new Date("2021-11-12"),
      confirmed: true,
      description: "wololo",
      comment: "that is nice",
    });
  });
});
