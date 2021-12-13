import { createReadStream } from 'fs';

import mockStream from './__mocks__/string-stream';
import parse from './parse';
import { Transaction } from './types';

describe("parse", () => {
  test("it works with file streams", async () => {
    const readStream = createReadStream(
      `pta-tools/src/__mocks__/prova.journal`
    );

    const p = await parse(readStream);
    expect(p.journal.length).toBe(6);
  });

  test("it works with string streams", async () => {
    const stream = mockStream(`
      2021-11-02 * Some shopping
      Assets:Crypto:Coinbase      -8.00 LTC @ 173.41 EUR
      Assets:Crypto:Coinbase                 1382.42 EUR
      Expenses:Fees:Coinbase
      
      2021-11-02
      Assets:Crypto:Coinbase    -0.5 ETH @ 3899.56 EUR
      Assets:Crypto:Coinbase               1942.96 EUR
      Expenses:Fees:Coinbase

      
      `);

    const p = await parse(stream);

    expect(p.journal.length).toBe(2);
    const first = p.journal[0] as Transaction;

    expect(first.date).toStrictEqual(new Date("2021-11-02"));
    expect(first.confirmed).toBe(true);
    expect(first.description).toBe("Some shopping");
    expect(first.entries.length).toBe(3);

    expect(first.entries[0]).toEqual({
      account: "Assets:Crypto:Coinbase",
      amount: "-8.00",
      commodity: "LTC",
      conversion: {
        amount: "173.41",
        commodity: "EUR",
      },
    });
  });

  test("Extracts Accounts", async () => {
    const stream = mockStream(`
      2021-11-02 * Some shopping
      Assets:Crypto:Coinbase      -8.00 LTC @ 173.41 EUR
      Assets:Crypto:Coinbase                 1382.42 EUR
      Expenses:Fees:Coinbase
      
      ; This is a comment

      2021-11-02
      Income:Salary:John        1000 USD
      Assets:Bank              -1000 USD
      [Budget:Holidays]         -200 USD
      [Assets:Bank]
      `);

    const p = await parse(stream);

    expect(p.accounts).toEqual([
      "Assets:Crypto:Coinbase",
      "Assets:Bank",
      "Expenses:Fees:Coinbase",
      "Income:Salary:John",
      "Budget:Holidays",
    ]);
  });

  test("Extracts Commodities", async () => {
    const stream = mockStream(`
      2021-11-02 * Some shopping
      Assets:Crypto:Coinbase      -8.00 LTC @ 173.41 EUR
      Assets:Crypto:Coinbase                 1382.42 USD
      Expenses:Fees:Coinbase
      
      2021-11-02
      Assets:Crypto:Coinbase    -0.5 ETH @ 3899.56 EUR
      Assets:Crypto:Coinbase               1942.96 EUR
      Expenses:Fees:Coinbase
      `);

    const p = await parse(stream);

    expect(p.commodities).toEqual(["LTC", "EUR", "USD", "ETH"]);
  });
});

describe("Comments", () => {
  test("Finds comments inside transactions", async () => {
    const stream = createReadStream(`pta-tools/src/__mocks__/prova.journal`);
    const p = await parse(stream);

    const trx = p.journal.find(
      (t) => (t as Transaction).description === "Nulla"
    ) as Transaction;

    expect(trx.comment).toBe("comment");
  });
});
