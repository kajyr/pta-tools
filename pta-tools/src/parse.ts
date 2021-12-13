import split2 from 'split2';

import getAccounts from './get-accounts';
import getCommodities from './get-commodities';
import Parser from './parser';
import { Comment, Journal, Transaction } from './types';

export type ParseResult = {
  journal: Journal;
  accounts: string[];
  commodities: string[];
};

function parse(stream: NodeJS.ReadableStream): Promise<ParseResult> {
  const trxs: Journal = [];
  const transformer = new Parser();

  return new Promise((resolve, reject) => {
    stream
      .pipe(split2())
      .pipe(transformer)
      .on("data", (data: Transaction | Comment) => {
        trxs.push(data);
      })
      .on("end", () => {
        resolve({
          journal: trxs,
          accounts: getAccounts(trxs),
          commodities: getCommodities(trxs),
        });
      })
      .on("error", () => {
        reject();
      });
  });
}

export default parse;
