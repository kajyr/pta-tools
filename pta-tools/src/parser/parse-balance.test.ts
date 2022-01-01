import parseBalance from './parse-balance';

describe("parseBalance", () => {
  test("Balance assignement", () => {
    expect(
      parseBalance("Liabilities:Cards", "= -185.77 EUR", undefined)
    ).toEqual({
      account: "Liabilities:Cards",
      balance: { amount: "-185.77", commodity: "EUR" },
    });
  });

  test("Balance assertion", () => {
    expect(
      parseBalance("Liabilities:Cards", "-20 EUR = 70 USD", undefined)
    ).toEqual({
      account: "Liabilities:Cards",
      amount: "-20",
      commodity: "EUR",
      balance: { amount: "70", commodity: "USD" },
    });
  });
});
