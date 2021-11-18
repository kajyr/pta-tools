import getCommodities from './get-commodities';
import { Transaction } from './types';

describe("getCommodities", () => {
  it("Returs the commodities", () => {
    const trx: Transaction[] = [
      {
        date: new Date("2021-11-11"),
        description: "test",
        entries: [{ account: "Assets:Cash", amount: "-100", commodity: "USD" }],
      },
      {
        date: new Date("2021-11-11"),
        description: "test",
        entries: [{ account: "Assets:Cash", amount: "100", commodity: "EUR" }],
      },
      {
        date: new Date("2021-11-11"),
        description: "test",
        entries: [
          {
            account: "Assets:Cash",
            amount: "-100",
            commodity: "USD",
            conversion: {
              amount: "1",
              commodity: "EUR",
            },
          },
        ],
      },
    ];
    expect(getCommodities(trx)).toEqual(["USD", "EUR"]);
  });
});
