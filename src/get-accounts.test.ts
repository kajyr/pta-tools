import getAccounts from './get-accounts';
import { Transaction } from './types';

describe("getAccounts", () => {
  it("Returs the accounts", () => {
    const trx: Transaction[] = [
      {
        date: new Date("2021-11-11"),
        description: "test",
        entries: [{ account: "Assets:Cash", amount: "-100", commodity: "USD" }],
      },
    ];
    expect(getAccounts(trx)).toEqual(["Assets:Cash"]);
  });
});
