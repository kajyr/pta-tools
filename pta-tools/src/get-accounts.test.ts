import getAccounts from './get-accounts';
import { Transaction } from './types';

function mockTransaction(accountIn: string, accountOut: string): Transaction {
  return {
    date: new Date("2021-11-11"),
    description: "test",
    entries: [
      { account: accountIn, amount: "100", commodity: "USD" },
      { account: accountOut, amount: "-100", commodity: "USD" },
    ],
  };
}

describe("getAccounts", () => {
  it("Returs the accounts, sorted by usage", () => {
    const journal = [
      mockTransaction("Expenses:Groceries", "Assets:Cash"),
      mockTransaction("Expenses:Groceries", "Assets:AAA"),
      mockTransaction("Expenses:Groceries", "Assets:Cash"),
      mockTransaction("Expenses:Groceries", "Assets:Cash"),
    ];

    expect(getAccounts(journal)).toEqual([
      "Expenses:Groceries",
      "Assets:Cash",
      "Assets:AAA",
    ]);
  });
});
