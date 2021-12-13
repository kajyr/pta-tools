import split2 from 'split2';

import { collect } from './array';
import getAccounts from './get-accounts';
import getCommodities from './get-commodities';
import Parser from './parser';
import { Journal, JournalEntries } from './types';

export type ParseResult = {
  journal: Journal;
  accounts: string[];
  commodities: string[];
};

async function parse(stream: NodeJS.ReadableStream): Promise<ParseResult> {
  const transformer = new Parser();

  const readable = stream.pipe(split2()).pipe(transformer);

  const journal = await collect<JournalEntries>(readable);

  return {
    journal,
    accounts: getAccounts(journal),
    commodities: getCommodities(journal),
  };
}

export default parse;
