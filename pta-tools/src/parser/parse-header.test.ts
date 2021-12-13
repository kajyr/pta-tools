import parseHeaderLine from './parse-header';

describe("parseHeaderLine", () => {
  it("Confirmed and description", () => {
    expect(parseHeaderLine("2021-11-02 * Description")).toEqual({
      date: new Date("2021-11-02"),
      confirmed: true,
      description: "Description",
    });
  });

  it("Not confirmed", () => {
    expect(parseHeaderLine("2021-11-02 Foo")).toEqual({
      date: new Date("2021-11-02"),
      confirmed: false,
      description: "Foo",
    });
  });

  it("No description", () => {
    expect(parseHeaderLine("2021-11-02")).toEqual({
      date: new Date("2021-11-02"),
      confirmed: false,
      description: "",
    });
  });
});
