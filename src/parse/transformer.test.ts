import { parseEntryLine, parseHeaderLine } from './transformer';

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

describe("parseEntryLine", () => {
  test("Line with commodity", () => {
    expect(parseEntryLine("Assets:Crypto:Coinbase  1942.96 EUR")).toEqual({
      account: "Assets:Crypto:Coinbase",
      amount: "1942.96",
      commodity: "EUR",
    });
  });
  test("Line with just account", () => {
    expect(parseEntryLine("Assets:Crypto:Coinbase")).toEqual({
      account: "Assets:Crypto:Coinbase",
      amount: undefined,
      commodity: undefined,
    });
  });

  test("Line with just value", () => {
    expect(parseEntryLine("Assets:Bank  34.00")).toEqual({
      account: "Assets:Bank",
      amount: "34.00",
      commodity: undefined,
    });
  });

  test("Line with conversion data", () => {
    expect(parseEntryLine("Assets:Crypto      -8.00 LTC @ 173.41 EUR")).toEqual(
      {
        account: "Assets:Crypto",
        amount: "-8.00",
        commodity: "LTC",
        conversion: { amount: "173.41", commodity: "EUR" },
      }
    );
  });
});
