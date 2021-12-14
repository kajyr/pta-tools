import { Readable } from "stream";

import { collect } from "../array";
import { Journal } from "../types";

import Formatter from "./";
import Parser from "../parser";

function mockStream(journal: Journal) {
  const stream = new Readable({ objectMode: true });

  stream._read = function () {
    for (const item of journal) {
      this.push(item);
    }
    this.push(null);
  };

  return stream;
}

function mockStringStream(str: string) {
  const stream = new Readable({ objectMode: true });

  stream._read = function () {
    for (const item of str.split("\n")) {
      this.push(item);
    }
    this.push(null);
  };

  return stream;
}

async function readableToString(readable: Readable) {
  return (await collect<string>(readable)).join("");
}

describe("Formatter", () => {
  test("It works", async () => {
    const stream = mockStream([
      {
        comment: "comment",
        date: new Date("2019-01-01"),
        description: "Supermarket",
        entries: [
          { amount: 10, account: "Expenses:Shopping" },
          { account: "Assets:Cash" },
          { message: "this is a comment" },
        ],
      },
      { message: "I should drink more" },
      { symbol: "P", data: "2021-11-02 LTC 173 EUR" },
      {
        date: new Date("2019-01-02"),
        description: "Yoox",
        entries: [
          { amount: 10, account: "Expenses:Shopping" },
          { account: "Liabilities:Visa" },
        ],
      },
    ]);
    const formatter = new Formatter();

    const result = stream.pipe(formatter);

    const str = await readableToString(result);

    expect(str).toMatchInlineSnapshot(`
"2019-01-01 Supermarket ; comment
    Expenses:Shopping                10
    Assets:Cash
    ; this is a comment

; I should drink more

P 2021-11-02 LTC 173 EUR

2019-01-02 Yoox
    Expenses:Shopping                10
    Liabilities:Visa

"
`);
  });
});

describe("Parser + Formatter", () => {
  test("Basics", async () => {
    const initial = `2021-11-02 * Some shopping
    Expenses Groceries           30 EUR
    Assets:Cash

; This is a comment non indented

2021-11-02 
    Income:Salary:John         1000 USD
    Assets:Bank

`;

    const result = mockStringStream(initial)
      .pipe(new Parser())
      .pipe(new Formatter());

    const str = await readableToString(result);

    expect(str).toBe(initial);
  });

  test("Virtual Postings", async () => {
    const initial = `2021-11-02 * Some budgetting
    [Expenses:Groceries]         30 EUR
    [Assets:Cash]

`;

    const result = mockStringStream(initial)
      .pipe(new Parser())
      .pipe(new Formatter());

    const str = await readableToString(result);

    expect(str).toBe(initial);
  });

  test("Rebalances", async () => {
    const initial = `2021-11-02 * rebalance of some assets
    Assets:Cash                  = 30 EUR
    Equity:Rebalances

`;

    const result = mockStringStream(initial)
      .pipe(new Parser())
      .pipe(new Formatter());

    const str = await readableToString(result);

    expect(str).toBe(initial);
  });
});
