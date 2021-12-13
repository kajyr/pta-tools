import { Readable } from 'stream';

import { collect } from '../array';
import { isComment } from '../type-guards';
import { Comment } from '../types';

import Parser from './';

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
  test.only("Finds out standalone comments", async () => {
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
});
