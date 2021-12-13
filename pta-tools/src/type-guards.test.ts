import { isTransaction } from './type-guards';
import { Comment, Transaction } from './types';

describe("isTransaction", () => {
  test("passes", () => {
    const trx: Transaction = {
      date: new Date("2021-11-11"),
      description: "test",
      entries: [{ account: "Assets:Cash", amount: "-100", commodity: "USD" }],
    };
    expect(isTransaction(trx)).toBe(true);
  });

  test("false", () => {
    const c: Comment = { message: "test" };
    expect(isTransaction(c)).toBe(false);
    expect(isTransaction({})).toBe(false);
    expect(isTransaction(null)).toBe(false);
  });
});
