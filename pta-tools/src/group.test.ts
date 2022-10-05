import { groupMonthly } from "./group";
import { Journal } from "./types";

describe("Monthly grouping", () => {
  test("Basic grouping", () => {
    const journal: Journal = [
      {
        date: "2021-06-02T00:00:00.000Z",
        entries: [
          {
            message: "comment",
          },
          {
            account: "Assets:Cash",
          },
          {
            amount: "20",
            account: "Expenses:Groceries",
            commodity: "EUR",
          },
        ],
      },
      {
        message: "comment",
      },
      {
        date: "2021-06-04T00:00:00.000Z",
        entries: [
          {
            amount: "40",
            account: "Expenses:Groceries",
            commodity: "EUR",
          },
          {
            account: "Assets:Cash",
          },
        ],
      },
      {
        symbol: "P",
        date: "2021-11-02T00:00:00.000Z",
        content: "BNB 475 EUR",
      },
    ];

    expect(groupMonthly(journal)).toEqual({
      "Assets:Cash": {
        "2021-06-01": { EUR: -60 },
      },
      "Expenses:Groceries": {
        "2021-06-01": { EUR: 60 },
      },
    });
  });

  test("Different commodities", () => {
    const journal: Journal = [
      {
        date: "2021-06-02T00:00:00.000Z",
        entries: [
          {
            account: "Assets:Cash",
          },
          {
            amount: "1",
            account: "Expenses:Pizza",
            commodity: "ETH",
          },
        ],
      },
      {
        date: "2021-06-04T00:00:00.000Z",
        entries: [
          {
            amount: "40",
            account: "Expenses:Groceries",
            commodity: "EUR",
          },
          {
            account: "Assets:Cash",
          },
        ],
      },
      {
        symbol: "P",
        date: "2021-11-02T00:00:00.000Z",
        content: "BNB 475 EUR",
      },
    ];

    expect(groupMonthly(journal)).toEqual({
      "Assets:Cash": {
        "2021-06-01": { EUR: -40, ETH: -1 },
      },
      "Expenses:Groceries": {
        "2021-06-01": { EUR: 40 },
      },
      "Expenses:Pizza": {
        "2021-06-01": { ETH: 1 },
      },
    });
  });
});
