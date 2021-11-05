import { createReadStream } from 'fs';

import mockStream from './__mocks__/string-stream';
import parse, { parseEntryLine, parseHeaderLine } from './parse';

describe("parseHeaderLine", () => {
  it("Confirmed and description", () => {
    expect(parseHeaderLine("2021-11-02 * Description")).toEqual({
      date: new Date("2021-11-02"),
      confirmed: true,
      description: "Description",
    });
  });

  it("Not confirmed", () => {
    expect(parseHeaderLine("2021-11-02 Foo")).toEqual({
      date: new Date("2021-11-02"),
      confirmed: false,
      description: "Foo",
    });
  });

  it("No description", () => {
    expect(parseHeaderLine("2021-11-02")).toEqual({
      date: new Date("2021-11-02"),
      confirmed: false,
      description: "",
    });
  });
});

describe("parseEntryLine", () => {
  test("Line with commodity", () => {
    expect(parseEntryLine("Assets:Crypto:Coinbase  1942.96 EUR")).toEqual({
      account: "Assets:Crypto:Coinbase",
      amount: "1942.96",
      commodity: "EUR",
    });
  });
  test("Line with just account", () => {
    expect(parseEntryLine("Assets:Crypto:Coinbase")).toEqual({
      account: "Assets:Crypto:Coinbase",
      amount: undefined,
      commodity: undefined,
    });
  });

  test("Line with just value", () => {
    expect(parseEntryLine("Assets:Bank  34.00")).toEqual({
      account: "Assets:Bank",
      amount: "34.00",
      commodity: undefined,
    });
  });

  test("Line with conversion data", () => {
    expect(parseEntryLine("Assets:Crypto      -8.00 LTC @ 173.41 EUR")).toEqual(
      {
        account: "Assets:Crypto",
        amount: "-8.00",
        commodity: "LTC",
        conversion: { amount: "173.41", commodity: "EUR" },
      }
    );
  });
});

describe("parse", () => {
  test("it works with file streams", async () => {
    const readStream = createReadStream(`src/__mocks__/prova.journal`);

    const p = await parse(readStream);

    expect(p.length).toBe(4);
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

    expect(p.length).toBe(2);
    const [first] = p;

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
});
