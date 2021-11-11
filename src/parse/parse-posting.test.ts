import parsePosting from './parse-posting';

describe("parsePosting", () => {
  test("Line with commodity", () => {
    expect(parsePosting("Assets:Crypto:Coinbase  1942.96 EUR")).toEqual({
      account: "Assets:Crypto:Coinbase",
      amount: "1942.96",
      commodity: "EUR",
    });
  });
  test("Line with just account", () => {
    expect(parsePosting("Assets:Crypto:Coinbase")).toEqual({
      account: "Assets:Crypto:Coinbase",
      amount: undefined,
      commodity: undefined,
    });
  });

  test("Line with just value", () => {
    expect(parsePosting("Assets:Bank  34.00")).toEqual({
      account: "Assets:Bank",
      amount: "34.00",
      commodity: undefined,
    });
  });

  test("Line with conversion data", () => {
    expect(parsePosting("Assets:Crypto      -8.00 LTC @ 173.41 EUR")).toEqual({
      account: "Assets:Crypto",
      amount: "-8.00",
      commodity: "LTC",
      conversion: { amount: "173.41", commodity: "EUR" },
    });
  });

  test("Rebalance", () => {
    expect(parsePosting("Liabilities:Cards     = -185.77 EUR")).toEqual({
      account: "Liabilities:Cards",
      amount: "-185.77",
      commodity: "EUR",
      is_rebalance: true,
    });
  });

  test("Supports virtual postings", () => {
    expect(
      parsePosting("(Assets:Crypto)      -8.00 LTC @ 173.41 EUR").account
    ).toBe("Assets:Crypto");

    expect(
      parsePosting("[Assets:Crypto]      -8.00 LTC @ 173.41 EUR").account
    ).toBe("Assets:Crypto");
  });
});
