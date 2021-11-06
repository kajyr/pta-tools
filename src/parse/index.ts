import split2 from 'split2';

import isTransaction from '../is-transaction';
import { Transaction } from '../types';

import Transformer from './transformer';

function unique<T>(list: T[]): T[] {
  return Array.from(new Set(list));
}

type Collectible = {
  type: "account" | "commodity";
  id: string;
};

export type ParseResult = {
  transactions: Transaction[];
  accounts: string[];
  commodities: string[];
};

function parse(stream: NodeJS.ReadableStream): Promise<ParseResult> {
  const trxs: Transaction[] = [];
  const transformer = new Transformer();
  const accounts: string[] = [];
  const commodities: string[] = [];

  return new Promise((resolve, reject) => {
    stream
      .pipe(split2())
      .pipe(transformer)
      .on("data", (data: Transaction | Collectible) => {
        if (isTransaction(data)) {
          trxs.push(data);
        } else if (data.type === "account") {
          accounts.push(data.id);
        } else if (data.type === "commodity") {
          commodities.push(data.id);
        }
      })
      .on("end", () => {
        resolve({
          transactions: trxs,
          accounts: unique(accounts),
          commodities: unique(commodities),
        });
      })
      .on("error", () => {
        reject();
      });
  });
}

export default parse;
