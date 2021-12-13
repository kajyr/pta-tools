import formatTransaction from './format-transaction';
import { Transaction } from './types';

describe("formatTransaction", () => {
  it("formats a basic trx", () => {
    const trx: Transaction = {
      date: new Date("2021-11-11"),
      description: "test",
      entries: [{ account: "Assets:Cash", amount: "-100", commodity: "USD" }],
    };
    expect(formatTransaction(trx)).toMatchInlineSnapshot(`
"2021-11-11 test
    Assets:Cash                -100 USD

"
`);
  });
});
