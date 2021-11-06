import { createReadStream } from 'fs';

import mockStream from '../__mocks__/string-stream';

import parse from './';

describe("parse", () => {
  test("it works with file streams", async () => {
    const readStream = createReadStream(`src/__mocks__/prova.journal`);

    const p = await parse(readStream);

    expect(p.transactions.length).toBe(4);
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

    expect(p.transactions.length).toBe(2);
    const [first] = p.transactions;

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
      
      2021-11-02
      Assets:Crypto:Coinbase    -0.5 ETH @ 3899.56 EUR
      Assets:Crypto:Coinbase               1942.96 EUR
      Expenses:Fees:Coinbase
      `);

    const p = await parse(stream);

    expect(p.accounts.length).toBe(2);
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
