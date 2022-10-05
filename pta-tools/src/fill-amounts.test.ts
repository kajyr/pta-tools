import { Posting, Transaction, TrxEntry } from "./types";

import fillAmounts from "./fill-amounts";

describe("fillAmounts", () => {
  test("Basic", () => {
    const trx: Transaction = {
      date: "2021-06-04T00:00:00.000Z",
      entries: [
        {
          amount: "40",
          account: "Expenses:Groceries",
          commodity: "EUR",
        },
        {
          amount: 10,
          account: "Expenses:Flowers",
          commodity: "EUR",
        },
        {
          account: "Assets:Cash",
        },
      ],
    };

    const filled = fillAmounts(trx);

    const last = filled.entries[filled.entries.length - 1] as Posting;

    expect(last.amount).toBe(-50);
  });

  test("Multi Commodity", () => {
    const trx: Transaction = {
      date: "2021-06-04T00:00:00.000Z",
      entries: [
        {
          amount: "40",
          account: "Expenses:Groceries",
          commodity: "EUR",
        },
        {
          amount: 1,
          account: "Expenses:Flowers",
          commodity: "ETH",
        },
        {
          account: "Assets:Cash",
        },
      ],
    };

    const filled = fillAmounts(trx);

    const catchEur = filled.entries[filled.entries.length - 2] as Posting;
    const catchEth = filled.entries[filled.entries.length - 1] as Posting;

    expect(catchEur.amount).toBe(-40);
    expect(catchEur.commodity).toBe("EUR");

    expect(catchEth.amount).toBe(-1);
    expect(catchEth.commodity).toBe("ETH");
  });

  test("More than one catchAll posting", () => {
    const trx: Transaction = {
      date: "2021-06-04T00:00:00.000Z",
      entries: [
        {
          amount: "40",
          account: "Expenses:Groceries",
          commodity: "EUR",
        },
        {
          account: "Assets:Bank",
        },
        {
          account: "Assets:Cash",
        },
      ],
    };

    expect(() => {
      fillAmounts(trx);
    }).toThrow();
  });
});
