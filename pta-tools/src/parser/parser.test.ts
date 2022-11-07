import { Readable } from "stream";

import { collect } from "../array";
import formatDate from "../formatter/format-date";
import { isComment, isDirective } from "../type-guards";
import { Comment, Directive, Posting, Transaction } from "../types";

import Parser from "./";

function mockStream(str: string) {
  const stream = new Readable({ objectMode: true });

  stream._read = function () {
    for (const item of str.split("\n")) {
      this.push(item);
    }
    this.push(null);
  };

  return stream;
}

describe("Parser", () => {
  test("Finds out standalone comments", async () => {
    const stream = mockStream(`2021-11-02 * Some shopping
    Expenses Groceries  30 EUR
    Assets:Cash

    ; this comment belongs to the prev trans.
      
; This is a comment non indented

2021-11-02
    Income:Salary:John        1000 USD
    Assets:Bank      
      `);

    const parser = new Parser();

    const result = await collect(stream.pipe(parser));

    expect(result.length).toBe(3);
    expect(isComment(result[1])).toBe(true);

    const c = result[1] as Comment;
    expect(c.message).toBe("This is a comment non indented");
  });

  test("Finds out directives", async () => {
    const stream = mockStream(`2021-11-02 * Some shopping
    Expenses Groceries  30 EUR
    Assets:Cash

    ; this comment belongs to the prev trans.
      
P 2021-11-02 LTC 173 EUR

2021-11-02
    Income:Salary:John        1000 USD
    Assets:Bank      
      `);

    const result = await collect(stream.pipe(new Parser()));

    expect(result.length).toBe(3);
    expect(isDirective(result[1])).toBe(true);

    const d = result[1] as Directive;
    expect(formatDate(d.date)).toBe("2021-11-02");
    expect(d.content).toBe("LTC 173 EUR");
  });

  test("Comments in entries", async () => {
    const stream = mockStream(`
2021-11-02 * Some shopping
    ; my oh my
    Expenses Groceries  30 EUR
    Assets:Cash
  `);

    const [result] = await collect<Transaction>(stream.pipe(new Parser()));

    expect(result.comment).toBeUndefined();
    expect(result.entries.length).toBe(3);
  });

  test("Comments in header", async () => {
    const stream = mockStream(`
2021-11-02 * Some shopping ; wowoo
    Expenses Groceries  30 EUR
    Assets:Cash
  `);

    const [result] = await collect<Transaction>(stream.pipe(new Parser()));

    expect(result.comment).toBe("wowoo");
    expect(result.entries.length).toBe(2);
  });

  test("Dates with slashes in header", async () => {
    const stream = mockStream(`
2021/11/02 * Some shopping
    Expenses Groceries  30 EUR
    Assets:Cash
  `);

    const [result] = await collect<Transaction>(stream.pipe(new Parser()));

    expect(formatDate(result.date)).toBe("2021-11-02");
    expect(result.entries.length).toBe(2);
  });
});
