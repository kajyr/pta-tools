import { Readable } from 'stream';

import Formatter from './formatter';
import { Journal } from './types';

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

async function readableToString(readable: Readable) {
  let result = "";
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
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
        ],
      },
    ]);
    const formatter = new Formatter();

    const result = stream.pipe(formatter);

    const str = await readableToString(result);

    expect(str).toBe(`2019-01-01 Supermarket
    Expenses:Shopping            10
    Assets:Cash

`);
  });
});
