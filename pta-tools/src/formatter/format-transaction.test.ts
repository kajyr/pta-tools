import { Posting, Transaction } from "../types";

import formatTransaction, { formatPosting } from "./format-transaction";

describe("formatTransaction", () => {
  test("formats a basic trx", () => {
    const trx: Transaction = {
      date: new Date("2021-11-11"),
      description: "test",
      entries: [
        { account: "Assets:Cash", amount: "10", commodity: "EUR" },
        {
          account: "Liabilities:Cards:VeryLongCardName",
          amount: "-100",
          commodity: "EUR",
        },
        { account: "Assets:Fineco", amount: "100", commodity: "EUR" },
      ],
    };
    expect(formatTransaction(trx)).toMatchInlineSnapshot(`
"2021-11-11 test
    Assets:Cash                            10 EUR
    Liabilities:Cards:VeryLongCardName   -100 EUR
    Assets:Fineco                         100 EUR

"
`);
  });
  test("formats a trx with comment", () => {
    const trx: Transaction = {
      date: new Date("2021-11-11"),
      description: "test",
      confirmed: true,
      comment: "I should not have bought this",
      entries: [
        { account: "Assets:Clothes", amount: "-100", commodity: "USD" },
        { message: "Did I pay?" },
      ],
    };
    expect(formatTransaction(trx)).toMatchInlineSnapshot(`
"2021-11-11 * test ; I should not have bought this
    Assets:Clothes             -100 USD
    ; Did I pay?

"
`);
  });
});

describe("formatPosting", () => {
  const suggested = 30;
  test("Line width with short posts", () => {
    const posting: Posting = {
      account: "Account",
      amount: "10",
      commodity: "USD",
    };
    const formatted = formatPosting(posting, suggested);
    expect(formatted.length).toBe(suggested);
  });
  test("Longer posts", () => {
    const posting: Posting = {
      account: "Liabilities:CreditCard:MyCreditCard",
      amount: "10",
      commodity: "USD",
    };
    const formatted = formatPosting(posting, suggested);
    expect(formatted.length).toBeGreaterThan(suggested);
  });
});
