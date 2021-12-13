import formatTransaction from './format-transaction';
import { Transaction } from './types';

describe("formatTransaction", () => {
  test("formats a basic trx", () => {
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
